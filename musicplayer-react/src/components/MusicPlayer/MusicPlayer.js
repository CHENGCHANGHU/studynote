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
      musicList: [
        { id: 1, title: "日落大道", picSrc: require("./sample/img/sunset-road.jpg"), musicSrc: require("./sample/music/sunset-road.mp3") },
        { id: 2, title: "飘向北方", picSrc: require("./sample/img/drift-north.jpg"), musicSrc: require("./sample/music/drift-north.mp3") },
        { id: 3, title: "Skin", picSrc: require("./sample/img/skin.jpg"), musicSrc: require("./sample/music/skin.mp3") },
        { id: 4, title: "又过了一年", picSrc: require("./sample/img/another-year.jpg"), musicSrc: require("./sample/music/another-year.mp3") },
      ],

      // 当前播放音乐的状态
      currMusicObj: null,
      currMusicIndex: -1,
      currMusicDuration: 0,
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
    this.state.theMusicAudio.src = this.state.currMusicObj.musicSrc;
    document.addEventListener("keypress", this.keyPressHandler);

    this.state.theMusicAudio.addEventListener("durationchange", this.durationChangeHandler);
    this.state.theMusicAudio.addEventListener("ended", this.endedHandler);
    this.state.theMusicAudio.addEventListener("timeupdate", this.timeUpdateHandler);

  }

  render() {
    const {
      theMusicAudio, playFlag, panelFlag, musicList, currMusicObj,
      currMusicTime,
      playedBarWidth,
      controllerLeft,
      currMusicDuration,
    } = this.state;
    return (
      <div className="MusicPlayer" onKeyPress={this.keyPressHandler}>
        <div className="ControlBox">
          {/* <audio src="./sunset-road.mp3" id="TheMusic"></audio> */}
          <div className="prev">
            <div id="prev"></div>
          </div>
          <div className="record-cover" id="recordCover">
            <img src={currMusicObj.picSrc} alt="封面" />
            <div className="pause" id="pause"></div>
            <div className="play" id="play"></div>
            {/* <div className="loading" id="loading">
              <div className="wave"></div>
            </div> */}
          </div>
          <div className="next">
            <div id="next"></div>
          </div>
          <div className="progress-box" id="progressBox">
            <div className="song-title">
              <span id="songTitle">{currMusicObj.title}</span>
              <span className="more" id="more" onClick={this.openMusicPanel}></span>
            </div>
            <div className="progress-bar" id="progressBar">
              <div className="played-bar" style={{ width: playedBarWidth }} id="playedBar"></div>
              <div className="controller" style={{ left: controllerLeft }} id="controller"></div>
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
              <input type="file" className="local-file" id="localFile" />
              <div className="local-music" id="localMusic">本地音乐</div>
            </div>
            <ul className="music-list">
              {/* <li className="active-music"><a href="#">
                <img className="pic" src={require("./sample/img/sunset-road.jpg")} />日落大道
            </a></li> */}
              {
                musicList.map((musicObj, index) => (
                  <li key={musicObj.id}>
                    <a href="#" onClick={() => this.changeMusicByMusicPanel(musicObj, index)}>
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

  playMusic = () => {
    console.log("MusicPlayer: 播放歌曲");
    this.setState({ ...this.state, playFlag: true });
    this.state.theMusicAudio.play();
  }

  pauseMusic = () => {
    console.log("MusicPlayer: 暂停歌曲");
    this.setState({ ...this.state, playFlag: false });
    this.state.theMusicAudio.pause();
  }

  changeMusicByMusicPanel = (musicObj, index) => {
    console.log(index, musicObj.id, musicObj.title);
    this.state.theMusicAudio.src = musicObj.musicSrc;
    this.playMusic();
    this.setState({
      ...this.state,
      currMusicObj: musicObj,
      currMusicIndex: index,
    });
  }

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

  endedHandler = () => {
    this.pauseMusic();
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
}