const theMusic = document.getElementById("TheMusic");

const sec2min = function (sec) {
  const min = Math.floor(sec / 60);
  sec = Math.floor(sec % 60);
  return `${min<10?'0'+min:min}:${sec<10?'0'+sec:sec}`;
}

const throttle = function (fn, delay) {
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

let currMusicUrl = `https://chengchanghu.github.io/studynote/MusicPlayer/sunset-road.mp3`;
let requestHeader = {
  method: "GET",
  accept: "audio/mp3",
  // cache: "force-cache",
  responseType: 'arraybuffer',
};

// setTimeout(async () => {
//   let respHeader = await fetch(currMusicUrl, requestHeader);
//   let respReader = respHeader.body.getReader();
//   let totalLength = respHeader.headers.get("Content-Length");
//   console.log(totalLength);
//   let loadedDataBuffer = new Uint8Array(totalLength);

//   let loadedLength = 0;

//   while (true) {
//     const {
//       value,
//       done
//     } = await respReader.read();
//     if (done) break;
//     // if (loadedLength < totalLength / 20) {
//     //   console.log(value);
//     // }

//     loadedDataBuffer.set(value, loadedLength);
//     loadedLength += value.length;

//     document.querySelector("#loading-progress").innerHTML = (loadedLength / totalLength * 100).toFixed(2) + "%";
//     document.querySelector("#loading div").style.height = (100 - (loadedLength / totalLength * 100)) + "%";
//     // document.querySelector("#loading").style.borderBottomWidth = loadedLength / totalLength * 100 + "%";
//   }
//   console.log(loadedDataBuffer);
//   let loadedBlob = new Blob([loadedDataBuffer]);
//   let blobURL = window.URL.createObjectURL(new Blob([loadedDataBuffer]));
//   console.log(blobURL);
//   // theMusic.src = blobURL;
//   // theMusic.src = "./sunset-road.mp3";
//   document.querySelector("#loading").style.display = "none";
//   document.querySelector("#recordCover").classList.add("play-status");
// }, 0);

document.querySelector("#loading").style.display = "none";
document.querySelector("#recordCover").classList.add("play-status");

const controlBox = document.querySelector(".ControlBox");
const recordCover = controlBox.querySelector("#recordCover");

let RAFid = 0;
let currTime = 0;
let lastTime = 0;

// 更新界面
const updateSongDuration = function () {
  currTime = theMusic.currentTime;

  document.querySelector(".curr-duration").textContent = sec2min(currTime);
  let percentage = currTime / theMusic.duration * 100;
  document.querySelector("#playedBar").style.width = percentage + "%";

  const Controller = document.querySelector("#controller");
  let currLeft = parseFloat(Controller.style.left.slice(0, -1)) || 0;
  if (currLeft > percentage) currLeft = 0;

  let speed = (percentage - currLeft) / 5;

  for (let i = currLeft; i < percentage; i += speed) {
    Controller.style.left = i + "%";
  }

  if (theMusic.paused) {
    recordCover.classList.remove("play-status");
    cancelAnimationFrame(RAFid);
  }
  lastTime = currTime;

  RAFid = requestAnimationFrame(updateSongDuration);
}

let moreFlag = false;

// 点击事件
controlBox.addEventListener("click", e => {
  let {
    clientX,
    clientY,
    target
  } = e, scale = 0;
  switch (e.target.getAttribute("id")) {
    case "play":
      console.log("播放歌曲");
      theMusic.play();
      recordCover.classList.remove("play-status");
      recordCover.classList.add("pause-status");
      RAFid = requestAnimationFrame(updateSongDuration);
      break;
    case "pause":
      console.log("暂停歌曲");
      theMusic.pause();
      recordCover.classList.remove("pause-status");
      recordCover.classList.add("play-status");
      cancelAnimationFrame(RAFid);
      break;
    case "progressBar":
      scale = (clientX - target.offsetLeft) / target.offsetWidth;
      theMusic.currentTime = scale * theMusic.duration;
      document.querySelector(".curr-duration").textContent = sec2min(scale * theMusic.duration);
      document.querySelector("#playedBar").style.width = scale * 100 + "%";
      document.querySelector("#controller").style.left = scale * 100 + "%";
      break
    case "playedBar":
      scale = (clientX - target.parentNode.offsetLeft) / target.parentNode.offsetWidth;
      theMusic.currentTime = scale * theMusic.duration;
      document.querySelector(".curr-duration").textContent = sec2min(scale * theMusic.duration);
      document.querySelector("#playedBar").style.width = scale * 100 + "%";
      document.querySelector("#controller").style.left = scale * 100 + "%";
      break;
    case "more":
      if (!moreFlag) {
        document.querySelector("#more").classList.add("more-active");
        document.querySelector("#musicPanel").classList.add("active-music-panel");
      } else {
        document.querySelector("#more").classList.remove("more-active");
        document.querySelector("#musicPanel").classList.remove("active-music-panel");
      }
      moreFlag = !moreFlag;
      break;
    case "localMusic":
      console.log("localMusic");
      document.querySelector("#localFile").click();
      break;
    default:
      break;
  }
});

document.querySelector("#localFile").addEventListener("change", e => {
  // console.log(e);
  // console.log(e.target);
  // console.log(e.target.files[0]);
  let localMusicFile = e.target.files[0];
  // theMusic.src = "./drift-north.mp3";
  // theMusic.src = window.URL.createObjectURL(localMusicFile);
  if (!!localMusicFile) {
    let reader = new FileReader();
    reader.readAsDataURL(localMusicFile);
    reader.onprogress = function (e) {
      console.log(e);
    };
    reader.onload = function () {
      console.log("本地音乐加载完成");
      // theMusic.src = window.URL.createObjectURL(localMusicFile);
      theMusic.src = this.result;
      // document.querySelector("#songTitle").innerHTML=localMusicFile.
      recordCover.classList.remove("pause-status");
      recordCover.classList.add("play-status");
      cancelAnimationFrame(RAFid);
      document.querySelector("#playedBar").style.width = "0%";
      document.querySelector("#controller").style.left = "0%";
    }
  }
});

let dragController = false;
let dragNode = null;
document.addEventListener("mousedown", e => {
  switch (e.target.getAttribute("id")) {
    case "controller":
      dragController = true;
      dragNode = e.target;
      break;
    default:
      break;
  }
});

document.addEventListener("mouseup", e => {
  if (dragController)
    dragController = false;
  // switch (e.target.getAttribute("id")) {
  //   case "controller":
  //     dragController = false;
  //     break;
  //   default:
  //     break;
  // }
});

const debounce = function (fn, delay) {
  let timer = 0;
  return function () {
    if (timer) {
      clearTimeout(timer);
      timer = setTimeout(fn, delay);
    } else {
      timer = setTimeout(fn, delay);
    }
  }
}

document.addEventListener("mousemove", e => {
  throttle(function () {
    if (dragController) {
      let {
        clientX,
        clientY,
        target
      } = e, scale = 0;
      if (clientX < dragNode.parentNode.offsetLeft + dragNode.parentNode.offsetWidth &&
        clientX > dragNode.parentNode.offsetLeft) {
        // console.log(clientX, dragNode.parentNode.offsetLeft, dragNode.parentNode.offsetWidth)
        scale = (clientX - dragNode.parentNode.offsetLeft) / dragNode.parentNode.offsetWidth;
        scale = Math.min(1.0, Math.max(0, scale));
        theMusic.currentTime = scale * theMusic.duration;
        document.querySelector(".curr-duration").textContent = sec2min(scale * theMusic.duration);
        document.querySelector("#playedBar").style.width = scale * 100 + "%";
        document.querySelector("#controller").style.left = scale * 100 + "%";
      }
    }
  }, 200)();
});

document.addEventListener("keypress", e => {
  switch (e.keyCode) {
    case 32:
      if (theMusic.paused) {
        console.log("播放歌曲");
        theMusic.play();
        recordCover.classList.remove("play-status");
        recordCover.classList.add("pause-status");
        RAFid = requestAnimationFrame(updateSongDuration);
      } else {
        console.log("暂停歌曲");
        theMusic.pause();
        recordCover.classList.remove("pause-status");
        recordCover.classList.add("play-status");
        cancelAnimationFrame(RAFid);
      }
      break;
    default:
      break
  }
})