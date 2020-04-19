const theMusic = document.getElementById("TheMusic");

const sec2min = function (sec) {
  const min = Math.floor(sec / 60);
  sec = Math.floor(sec % 60);
  return `${min<10?'0'+min:min}:${sec<10?'0'+sec:sec}`;
}

let RAFid = 0;
let currTime = 0;
let lastTime = 0;
// const songDuration = theMusic.duration;
// console.log(songDuration);
const updateSongDuration = function () {
  currTime = theMusic.currentTime;

  document.querySelector(".curr-duration").textContent = sec2min(currTime);
  let percentage = currTime / theMusic.duration * 100;
  document.querySelector("#playedBar").style.width = percentage + "%";
  const Controller = document.querySelector("#controller");
  let currLeft = parseFloat(Controller.style.left.slice(0, -1)) || 0;
  // console.log(currLeft, percentage);
  // console.log(lastTime, currTime);
  let speed = (percentage - currLeft) / 5;

  for (let i = currLeft; i < percentage; i += speed) {
    Controller.style.left = i + "%";
  }

  if (theMusic.paused) {
    cancelAnimationFrame(RAFid);
  }
  lastTime = currTime;

  RAFid = requestAnimationFrame(updateSongDuration);
}


const controlBox = document.querySelector(".ControlBox");
const recordCover = controlBox.querySelector("#recordCover");

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
      recordCover.classList.add("play-status");
      RAFid = requestAnimationFrame(updateSongDuration);
      break;
    case "pause":
      console.log("暂停歌曲");
      theMusic.pause();
      recordCover.classList.remove("play-status");
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
    default:
      break;
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
        recordCover.classList.add("play-status");
        RAFid = requestAnimationFrame(updateSongDuration);
      } else {
        console.log("暂停歌曲");
        theMusic.pause();
        recordCover.classList.remove("play-status");
        cancelAnimationFrame(RAFid);
      }
      break;
    default:
      break
  }
})