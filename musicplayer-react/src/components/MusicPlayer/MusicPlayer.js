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
      // localFileInput: null,
      musicList: [
        { id: 1, title: "日落大道", picSrc: require("./sample/img/sunset-road.jpg"), musicSrc: require("./sample/music/sunset-road.mp3") },
        { id: 2, title: "飘向北方", picSrc: require("./sample/img/drift-north.jpg"), musicSrc: require("./sample/music/drift-north.mp3") },
        { id: 3, title: "Skin", picSrc: require("./sample/img/skin.jpg"), musicSrc: require("./sample/music/skin.mp3") },
        { id: 4, title: "又过了一年", picSrc: require("./sample/img/another-year.jpg"), musicSrc: require("./sample/music/another-year.mp3") },
      ],

      // 当前播放音乐的状态
      currMusicObj: null,
      currMusicIndex: 3,
      currMusicDuration: 0,// 当前音乐时间总长
      currMusicTime: 0,
      playedBarWidth: 0,
      controllerLeft: 0,
      playFlag: false,
    }

    this.state.currMusicObj = this.state.musicList[3];
    this.state.theMusicAudio.src = this.state.currMusicObj.musicSrc;
    console.log(isNaN(this.state.theMusicAudio.duration));
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

    // 音乐事件监听
    theMusicAudio.addEventListener("durationchange", this.durationChangeHandler);
    theMusicAudio.addEventListener("ended", this.endedHandler);
    theMusicAudio.addEventListener("timeupdate", this.timeUpdateHandler);

    // document事件监听
    // document.addEventListener("mousemove", this.mouseMoveHandler);
    document.addEventListener("mouseup", this.mouseUpHandler);
  }

  render() {
    const {
      theMusicAudio, playFlag, panelFlag, musicList, currMusicObj,
      currMusicTime,
      playedBarWidth,
      controllerLeft,
      currMusicDuration,
      currMusicIndex
    } = this.state;
    return (
      <div className="MusicPlayer" onKeyPress={this.keyPressHandler}>
        <div className="ControlBox">
          {/* <audio src="./sunset-road.mp3" id="TheMusic"></audio> */}
          <div className="prev">
            <div id="prev" onClick={this.changeMusicByPrev}></div>
          </div>
          <div className={`record-cover ${playFlag ? "pause-status" : "play-status"}`} id="recordCover">
            <img src={currMusicObj.picSrc} alt="封面" />
            <div className="pause" id="pause" onClick={this.pauseMusic}></div>
            <div className="play" id="play" onClick={this.playMusic}></div>
            {/* <div className="loading" id="loading">
              <div className="wave"></div>
            </div> */}
          </div>
          <div className="next">
            <div id="next" onClick={this.changeMusicByNext}></div>
          </div>
          <div className="progress-box" id="progressBox">
            <div className="song-title">
              <span id="songTitle">{currMusicObj.title}</span>
              <span className={`more ${panelFlag ? "more-active" : ""}`} id="more" onClick={this.openMusicPanel}></span>
            </div>
            <div className="progress-bar"
              id="progressBar"
              onClick={event => this.clickProgressBarHandler(event)}>
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
          <div className={`music-panel ${panelFlag ? "active-music-panel" : ""}`} id="musicPanel">
            <div className="panel-header">歌曲面板
              {/* <input type="file" className="local-file" ref={this.state.localFileInput} id="localFile" /> */}
              <div className="local-music" id="localMusic">本地音乐</div>
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
                      <img className="pic" src={musicObj.picSrc} />
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
    this.state.theMusicAudio.src = musicObj.musicSrc;
    await this.playMusic();
    this.setState({
      ...this.state,
      currMusicObj: musicObj,
      currMusicIndex: index,
    });
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
    theMusicAudio.currentTime = scale * currMusicDuration;
    this.setState({ ...this.state, currMusicTime: scale * currMusicDuration });
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