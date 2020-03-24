let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let W = 400,
  H = 400,
  bgColor = "#000",
  frColor = "#eee",
  radius = 150,
  borderWidth = 5,
  hHandWidth = 10,
  hHandLen = 60,
  hHandRadian = 0,
  mHandWidth = 7,
  mHandLen = 80,
  mHandRadian = 0,
  sHandWidth = 3,
  sHandLen = 115,
  sHandRadian = 0;

canvas.setAttribute("width", W);
canvas.setAttribute("height", H);
canvas.style["background-color"] = "rgba(0,0,0,0)";

// 依据圆心获取指定半径、弧度的终端坐标 
const getCircleEnd = (cx, cy, radius, radian) => ({
  x: cx + radius * Math.sin(radian),
  y: cy - radius * Math.cos(radian)
});

// 外围圆
const drawBorder = (ctx, cx, cy, radius, borderWidth, frColor) => {
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, 2 * Math.PI, false);
  ctx.lineWidth = borderWidth;
  ctx.strokeStyle = frColor;
  ctx.stroke();
};
// drawBorder(ctx, W / 2, H / 2, radius, borderWidth, frColor);

// 绘制线
const drawLine = (ctx, fromX, fromY, toX, toY, lineWidth, strokeStyle, lineCap) => {
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = strokeStyle;
  ctx.lineCap = lineCap;
  ctx.stroke();
};

// 绘制针
const drawHand = (ctx, cx, cy, radius, radian, lineWidth, strokeStyle, lineCap) => {
  let endCoordinate = getCircleEnd(cx, cy, radius, radian);
  drawLine(ctx, cx, cy, endCoordinate.x, endCoordinate.y, lineWidth, strokeStyle, lineCap);
  endCoordinate = null;
}

// 时针 hour hand
// drawHand(ctx, W / 2, H / 2, hHandLen, hHandRadian, hHandWidth, frColor, "round");

// 分针 minute hand
// drawHand(ctx, W / 2, H / 2, mHandLen, mHandRadian, mHandWidth, frColor, "round");

// 秒针 second hand
// drawHand(ctx, W / 2, H / 2, sHandLen, sHandRadian, sHandWidth, frColor, "round");

// 绘制文字
const drawText = (ctx, cx, cy, radius) => {
  for (let i = 0; i < 12; i++) {
    let r = i / 6 * Math.PI;
    ctx.beginPath();
    ctx.arc(cx + radius * Math.sin(r), cy - radius * Math.cos(r), 8, 0, 2 * Math.PI, false);
    ctx.fillStyle = "#000";
    ctx.fill();

    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff";
    if (i === 0) {
      ctx.fillText("12", cx, cy - radius);
    } else {
      ctx.fillText("" + i, cx + radius * Math.sin(r), cy - radius * Math.cos(r));
    }
  }
}

// 绘制短线
const drawDash = (ctx, cx, cy, radius, dashLen, dashWidth) => {
  for (let i = 0; i < 60; i++) {
    if (i % 5 === 0) {
      continue;
    } else {
      ctx.beginPath();
      let start = getCircleEnd(cx, cy, radius, i / 30 * Math.PI);
      let end = getCircleEnd(cx, cy, radius + dashLen, i / 30 * Math.PI);
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.lineWidth = dashWidth;
      ctx.stroke();
    }
  }
}

const drawDate = (ctx, cx, cy, date) => {
  ctx.beginPath();
  ctx.font = "bold 14px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillStyle = "#000";
  ctx.fillText(date.toLocaleString(), cx, cy + 20);
}

// const updateClock = () => {
//   let mCount = 0;
//   let hCount = 0;
//   let lastT = 0;
//   let lastSRadian = 0;
//   let updateSecond = () => {
//     ctx.clearRect(0, 0, 400, 400);
//     drawBorder(ctx, W / 2, H / 2, radius, borderWidth, frColor);

//     let now = new Date();
//     let second = now.getSeconds();
//     let sRadian = second / 30 * Math.PI;
//     drawHand(ctx, W / 2, H / 2, sHandLen, sRadian, sHandWidth, frColor, "round");
//     requestAnimationFrame(updateSecond);
//     lastT = now.getTime();
//   }
//   requestAnimationFrame(updateSecond);
// }
// updateClock();

const updateClockHard = () => {
  ctx.clearRect(0, 0, 400, 400);
  drawBorder(ctx, W / 2, H / 2, radius, borderWidth, "#000");
  drawText(ctx, W / 2, H / 2, radius - 15);
  drawDash(ctx, W / 2, H / 2, radius - 15, 3, 2);
  let now = new Date();
  drawDate(ctx, W / 2, H / 2, now);

  drawHand(ctx, W / 2, H / 2, hHandLen, now.getHours() / 6 * Math.PI + now.getMinutes() / 420 * Math.PI, hHandWidth, "#a00", "round");
  drawHand(ctx, W / 2, H / 2, mHandLen, now.getMinutes() / 30 * Math.PI, mHandWidth, "#c00", "round");
  drawHand(ctx, W / 2, H / 2, sHandLen, now.getSeconds() / 30 * Math.PI, sHandWidth, "#e00", "round");
  requestAnimationFrame(updateClockHard);
  now = null;
}
requestAnimationFrame(updateClockHard);