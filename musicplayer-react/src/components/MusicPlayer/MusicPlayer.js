import React from "react";
// import style from "./MusicPlayer.css";
import "./MusicPlayer.css";

export default class MusicPlayer extends React.Component {
  constructor() {
    super(...arguments);
    const theMusicAudio = new Audio(null);
    this.state = {
      theMusicAudio,
      panelFlag: false,
      controllerFlag: false,
      controller: null,
      baseUrl: "https://chengchanghu.github.io/studynote/musicplayer-react/src/components/MusicPlayer",
      // localFileInput: null,
      loadingProgress: 0,
      musicList: [
        // { id: 1, title: "日落大道", picSrc: require("./sample/img/sunset-road.jpg"), musicSrc: require("./sample/music/sunset-road.mp3") },
        // { id: 2, title: "飘向北方", picSrc: require("./sample/img/drift-north.jpg"), musicSrc: require("./sample/music/drift-north.mp3") },
        // { id: 3, title: "Skin", picSrc: require("./sample/img/skin.jpg"), musicSrc: require("./sample/music/skin.mp3") },
        // { id: 4, title: "又过了一年", picSrc: require("./sample/img/another-year.jpg"), musicSrc: require("./sample/music/another-year.mp3") },
        { id: 1, title: "日落大道", picSrc: "/sample/img/sunset-road.jpg", musicSrc: "/sample/music/sunset-road.mp3" },
        { id: 2, title: "飘向北方", picSrc: "/sample/img/drift-north.jpg", musicSrc: "/sample/music/drift-north.mp3" },
        { id: 3, title: "Skin", picSrc: "/sample/img/skin.jpg", musicSrc: "/sample/music/skin.mp3" },
        { id: 4, title: "又过了一年", picSrc: "/sample/img/another-year.jpg", musicSrc: "/sample/music/another-year.mp3" },
      ],

      // 当前播放音乐的状态
      currMusicObj: null,
      currMusicIndex: 3,
      currMusicDuration: 0,// 当前音乐时间总长
      currMusicTime: 0,
      // currMusicBufferedTimeId: 0,
      currMusicBufferedLength: 0,
      playedBarWidth: 0,
      controllerLeft: 0,
      playFlag: false,
    }

    this.state.currMusicObj = this.state.musicList[3];
    // this.state.theMusicAudio.src = this.state.currMusicObj.musicSrc;
    // console.log(isNaN(this.state.theMusicAudio.duration));
  }

  openMusicPanel = () => {
    this.setState({ ...this.state, panelFlag: !this.state.panelFlag });
    // this.state.theMusic.play();
  }

  // unsafe
  // componentWillMount() {
  //   this.setState({ ...this.state, currMusicObj: this.state.musicList[3] });
  // }

  // shouldComponentUpdate() {
  //   if (this.state.theMusicAudio) return true;
  // }

  componentDidMount() {
    console.log(this.__proto__.constructor.name, ":componentDidMount");
    const { theMusicAudio, currMusicObj } = this.state;
    theMusicAudio.src = currMusicObj.musicSrc;
    document.addEventListener("keypress", this.keyPressHandler);

    // this.state.theMusicAudio.src = `https://chengchanghu.github.io/studynote/musicplayer-react/src/components/MusicPlayer/sample/music/another-year.mp3`;
    this.state.theMusicAudio.src = `${this.state.baseUrl}${this.state.musicList[this.state.currMusicIndex].musicSrc}`;

    // 音乐事件监听
    theMusicAudio.addEventListener("durationchange", this.durationChangeHandler);
    theMusicAudio.addEventListener("ended", this.endedHandler);
    theMusicAudio.addEventListener("timeupdate", this.timeUpdateHandler);

    // document事件监听
    // document.addEventListener("mousemove", this.mouseMoveHandler);
    document.addEventListener("mouseup", this.mouseUpHandler);

    // this.loadingResuorce();
    this.bufferedUpdateHandler();

    this.refs.localFile.addEventListener("change", event => this.changeMusicByInputFile(event));
  }

  // *******************************************************************************
  // 渲染
  render() {
    const {
      baseUrl,
      playFlag, panelFlag, musicList, currMusicObj,
      currMusicTime,
      playedBarWidth,
      controllerLeft,
      currMusicDuration,
      currMusicIndex,
      loadingProgress,
      currMusicBufferedLength,
    } = this.state;
    return (
      <div className="MusicPlayer" onKeyPress={this.keyPressHandler}>
        loadingProgress: <span>{loadingProgress}</span>
        <div className="ControlBox">
          {/* <audio src="./sunset-road.mp3" id="TheMusic"></audio> */}
          {/* 上一首按钮 */}
          <div className="prev">
            <div id="prev" onClick={this.changeMusicByPrev}></div>
          </div>
          {/* 封面按钮 */}
          <div className={`record-cover ${playFlag ? "pause-status" : "play-status"}`} id="recordCover">
            {/* <img src={currMusicObj.picSrc} alt="封面" /> */}
            <img src={baseUrl + currMusicObj.picSrc} alt="封面" />
            <div className="pause" id="pause" onClick={this.pauseMusic}></div>
            <div className="play" id="play" onClick={this.playMusic}></div>
            {/* <div className="loading" id="loading">
              <div className="wave"></div>
            </div> */}
          </div>
          {/* 下一首按钮 */}
          <div className="next">
            <div id="next" onClick={this.changeMusicByNext}></div>
          </div>

          {/* 进度 */}
          <div className="progress-box" id="progressBox">

            {/* 歌曲名称栏 */}
            <div className="song-title">
              <span id="songTitle">{currMusicObj.title}</span>

              {/* 歌曲面板展开按钮 */}
              <span className={`more ${panelFlag ? "more-active" : ""}`} id="more" onClick={this.openMusicPanel}></span>
            </div>

            {/* 进度条 */}
            <div className="progress-bar"
              id="progressBar"
              onClick={event => this.clickProgressBarHandler(event)}>
              <div className="buffered-bar"
                style={{ width: currMusicBufferedLength }}
                onClick={event => this.clickBufferedBarHandler(event)}></div>
              <div className="played-bar"
                onClick={event => {
                  console.log("played-bar");
                  this.clickPlayedBarHandler(event);
                  event.stopPropagation();
                }}
                style={{ width: playedBarWidth }} id="playedBar"></div>
              <div className="controller"
                onClick={event => {
                  console.log("click controller");
                  event.stopPropagation();
                }}
                onMouseDown={event => {
                  this.mouseDownControllerHandler(event);
                  event.preventDefault();
                }}
                // onMouseUp={event => {
                //   this.mouseUpControllerHandler(event);
                // }}
                style={{ left: controllerLeft }} id="controller"></div>
            </div>

            {/* 歌曲时间 */}
            <div className="song-duration">
              <span className="curr-duration">
                {this.sec2min(currMusicTime)}
              </span>
              /
              <span className="total-duration">
                {/* {!isNaN(theMusicAudio.duration) ? this.sec2min(theMusicAudio.duration) : "00:00"} */}
                {this.sec2min(currMusicDuration)}
              </span>
            </div>
          </div>

          {/* 歌曲面板 */}
          <div className={`music-panel ${panelFlag ? "active-music-panel" : ""}`} id="musicPanel">
            <div className="panel-header">歌曲面板
              <input type="file" className="local-file" ref="localFile" id="localFile" />
              <div className="local-music" id="localMusic"
                onClick={this.clickLocalMusicHandler}>本地音乐</div>
            </div>
            <ul className="music-list">
              {
                musicList.map((musicObj, index) => (
                  <li key={musicObj.id}
                    className={currMusicIndex === index ? "active-music" : ""}>
                    <a href="#"
                      onClick={event => {
                        this.changeMusicByMusicPanel(musicObj, index);
                        event.preventDefault();
                      }}>
                      <img className="pic" src={baseUrl + musicObj.picSrc} />
                      {musicObj.title}
                    </a>
                  </li>)
                )
              }
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // 播放音乐
  playMusic = () => {
    console.log("MusicPlayer: 播放歌曲");
    this.setState({ ...this.state, playFlag: true });
    console.log(this.state.theMusicAudio.currentTime, this.state.currMusicDuration);
    // if (Math.abs(this.state.theMusicAudio.currentTime - this.state.currMusicDuration) < 1.0) return;
    this.state.theMusicAudio.play();
  }

  // 暂停音乐
  pauseMusic = () => {
    console.log("MusicPlayer: 暂停歌曲");
    this.setState({ ...this.state, playFlag: false });
    this.state.theMusicAudio.pause();
  }

  // 歌曲列表项点击事件处理器
  changeMusicByMusicPanel = async (musicObj, index) => {
    console.log(index, musicObj.id, musicObj.title);
    this.state.theMusicAudio.src =
      musicObj.musicSrc.slice(0, 4) === "blob" ? musicObj.musicSrc : this.state.baseUrl + musicObj.musicSrc;
    await this.playMusic();
    this.setState({
      ...this.state,
      currMusicObj: musicObj,
      currMusicIndex: index,
    });
  }

  // 本地音乐点击事件
  clickLocalMusicHandler = event => {
    console.log("本地音乐点击事件", this.refs.localFile);
    this.refs.localFile.click();
  }

  // 音乐输入改变事件处理器
  changeMusicByInputFile = event => {
    const { musicList } = this.state;
    console.log("音乐输入改变");
    let localMusicFile = event.target.files[0];
    console.log(localMusicFile);

    if (!!localMusicFile) {
      let reader = new FileReader();
      reader.readAsDataURL(localMusicFile);
      reader.onprogress = function (e) {
        console.log(e);
      };
      reader.onload = async () => {
        console.log("本地音乐加载完成");
        let musicSrc = window.URL.createObjectURL(localMusicFile);
        console.log(musicSrc);
        this.state.theMusicAudio.src = musicSrc;

        await this.setState({
          ...this.state,
          musicList: [...musicList, {
            id: musicList.length + 1,
            title: localMusicFile.name,
            picSrc: "/sample/img/music-4.png",
            musicSrc
          }]
        });

        await this.setState({
          ...this.state,
          currMusicIndex: this.state.musicList.length - 1,
          currMusicObj: this.state.musicList[this.state.musicList.length - 1],
        });

        this.state.theMusicAudio.play();

        // theMusic.src = this.result;
        // // document.querySelector("#songTitle").innerHTML=localMusicFile. 
        // recordCover.classList.remove("pause-status");
        // recordCover.classList.add("play-status");
        // cancelAnimationFrame(RAFid);
        // document.querySelector("#playedBar").style.width = "0%";
        // document.querySelector("#controller").style.left = "0%";
        // document.querySelector("#songTitle").innerHTML = localMusicFile.name;
      }
    }
  }

  // 上一首点击事件处理器
  changeMusicByPrev = async () => {
    const { theMusicAudio, currMusicIndex, musicList } = this.state;
    let index = currMusicIndex > 0 ? currMusicIndex - 1 : musicList.length - 1;
    theMusicAudio.src = musicList[index].musicSrc;
    await this.setState({
      ...this.state,
      currMusicObj: musicList[index],
      currMusicIndex: index,
    });
    this.playMusic();
  }

  // 下一首点击事件处理器
  changeMusicByNext = async () => {
    const { theMusicAudio, currMusicIndex, musicList } = this.state;
    let index = currMusicIndex < musicList.length - 1 ? currMusicIndex + 1 : 0;
    theMusicAudio.src = musicList[index].musicSrc;
    await this.setState({
      ...this.state,
      currMusicObj: musicList[index],
      currMusicIndex: index,
    });
    this.playMusic();
  }

  // 进度条点击事件处理器
  clickProgressBarHandler = event => {
    const { theMusicAudio, currMusicDuration } = this.state;
    const { clientX, target: { offsetLeft, offsetWidth } } = event;
    const scale = Math.min(1, Math.max(0, (clientX - offsetLeft) / offsetWidth));
    console.log("进度条点击事件", clientX, offsetLeft, offsetWidth, scale);
    // theMusicAudio.currentTime = scale * currMusicDuration;
    // this.setState({ ...this.state, currMusicTime: scale * currMusicDuration });
  }

  // 缓冲条点击事件处理器
  clickBufferedBarHandler = event => {
    const { theMusicAudio, currMusicDuration } = this.state;
    const { clientX, target: { parentNode: { offsetLeft, offsetWidth } } } = event;
    const scale = Math.min(1, Math.max(0, (clientX - offsetLeft) / offsetWidth));
    console.log("缓冲条条点击事件", clientX, offsetLeft, offsetWidth, scale);
    theMusicAudio.currentTime = scale * currMusicDuration;
    this.setState({ ...this.state, currMusicTime: scale * currMusicDuration });
    event.stopPropagation();
  }

  // 已播放进度条点击事件处理器
  clickPlayedBarHandler = event => {
    const { theMusicAudio, currMusicDuration } = this.state;
    const { clientX, target: { parentNode: { offsetLeft, offsetWidth } } } = event;
    const scale = Math.min(1, Math.max(0, (clientX - offsetLeft) / offsetWidth));
    console.log("已播放进度条点击事件", clientX, offsetLeft, offsetWidth, scale);
    theMusicAudio.currentTime = scale * currMusicDuration;
    this.setState({ ...this.state, currMusicTime: scale * currMusicDuration });
  }

  // 进度控制器按下事件处理器
  mouseDownControllerHandler = async event => {
    console.log("进度控制器按下事件", event.clientX, event.target.parentNode.offsetLeft);
    await this.setState({ ...this.state, controllerFlag: true, controller: event.target });
    document.addEventListener("mousemove", this.mouseMoveHandler);
    console.log(this.state.controllerFlag);
    this.pauseMusic();
  }

  // 鼠标松开事件处理器
  mouseUpHandler = async event => {
    if (this.state.controllerFlag && this.state.controller) {
      console.log("鼠标松开事件", event);
      await this.setState({ ...this.state, controllerFlag: false, controller: null });
      document.removeEventListener("mousemove", this.mouseMoveHandler);
      this.playMusic();
    }
    event.stopPropagation();
  }

  // 鼠标移动事件
  mouseMoveHandler = event => {
    this.throttle(() => {
      if (this.state.controllerFlag) {
        const { theMusicAudio,
          controller: { parentNode: { offsetLeft, offsetWidth } },
          currMusicDuration } = this.state,
          { clientX } = event,
          scale = Math.min(1, Math.max(0, (clientX - offsetLeft) / offsetWidth));
        theMusicAudio.currentTime = scale * currMusicDuration;
        this.setState({ ...this.state, currMusicTime: scale * currMusicDuration });
      }
    }, 200)();
  }

  // 键盘按键处理器
  keyPressHandler = event => {
    console.log(event.keyCode);
    let { theMusicAudio, playFlag } = this.state;
    switch (event.keyCode) {
      case 32:
        if (!playFlag) {
          this.playMusic();
        } else {
          this.pauseMusic();
        }
        break;
      default: break;
    }
  }

  // 音乐时长改变处理器
  durationChangeHandler = () => {
    // console.log(this.state.theMusicAudio.duration);
    // this.setState({ ...this.state });
    this.setState({ ...this.state, currMusicDuration: this.state.theMusicAudio.duration });
  }

  // 音乐结束事件处理器
  endedHandler = () => {
    this.pauseMusic();
    if (this.state.controllerFlag) return;
    this.changeMusicByNext();
  }

  // 时间更新处理器
  timeUpdateHandler = event => {
    let currentTime = this.state.theMusicAudio.currentTime;
    let percntage = currentTime / this.state.currMusicDuration * 100;

    this.setState({
      ...this.state,
      currMusicTime: currentTime,
      playedBarWidth: `${percntage}%`,
      controllerLeft: `${percntage}%`
    });
  }

  // 缓冲区更新处理器
  bufferedUpdateHandler = () => {
    setTimeout(() => {
      const { currMusicDuration, theMusicAudio } = this.state;
      const timeRanges = theMusicAudio.buffered;
      if (timeRanges.length != 0) {
        this.setState({
          ...this.state,
          currMusicBufferedLength: `${timeRanges.end(timeRanges.length - 1) / currMusicDuration * 100}%`
        });
        if (timeRanges.end(timeRanges.length - 1) < currMusicDuration)
          this.bufferedUpdateHandler();
      }
    }, 500);
  }

  // 加载资源
  loadingResuorce = () => {
    let p = new Promise(async (resolve, reject) => {
      const { baseUrl, currMusicIndex, musicList } = this.state;
      let currMusicUrl = `${baseUrl}${musicList[currMusicIndex]}`;
      let requestHeader = {
        method: "GET",
        accept: "audio/mp3",
        // cache: "force-cache",
        responseType: 'arraybuffer',
      };
      let respHeader = await fetch(currMusicUrl, requestHeader);
      let respReader = respHeader.body.getReader();
      let totalLength = respHeader.headers.get("Content-Length");
      console.log("totalLength:", totalLength);
      let loadedDataBuffer = new Uint8Array(totalLength);

      let loadedLength = 0;

      while (true) {
        const {
          value,
          done
        } = await respReader.read();
        if (done) break;
        if (loadedLength > totalLength / 10) {
          console.log(value);
          break;
        }

        // console.log(loadedLength);
        loadedDataBuffer.set(value, loadedLength);
        loadedLength += value.length;

        this.setState({ ...this.state, loadingProgress: (loadedLength / totalLength * 100).toFixed(2) + "%" });
      }
      console.log(loadedDataBuffer);
      let blobURL = window.URL.createObjectURL(new Blob([loadedDataBuffer]));
      resolve(blobURL);

      // let audio = new Audio(blobURL);
      // audio.play();

      // loadingCover.style.display = "none";
      // recordCover.classList.add("play-status");
    }).then(url => {
      console.log(url);
      // this.state.theMusicAudio.src = url;
    });
  }

  sec2min = sec => {
    const min = Math.floor(sec / 60);
    sec = Math.floor(sec % 60);
    return `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`;
  }

  throttle = (fn, delay) => {
    let valid = true;
    return function () {
      if (!valid) {
        return false;
      }
      valid = false;
      setTimeout(() => {
        fn();
        valid = true;
      }, delay);
    }
  }
}