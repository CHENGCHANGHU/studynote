// webgl上下文环境、数据、顶点数目、绘制模式
function basicDraw(gl, data, num, mode) {
  // 创建缓冲区对象
  const vertextBuffer = gl.createBuffer();
  if (!vertextBuffer) {
    console.log("无法创建缓冲区对象");
    return -1;
  }

  // 将缓冲区对象绑定到目标
  gl.bindBuffer(gl.ARRAY_BUFFER, vertextBuffer);

  // 向缓冲区对象中写入数据
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  let a_position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_position < 0) {
    console.log("无法获取attribute变量的存储位置");
    return -1;
  }

  // 将缓冲区对象分配给a_position变量
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);

  // 连接a_position变量与分配的缓冲区对象
  gl.enableVertexAttribArray(a_position);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 绘制
  gl.drawArrays(mode, 0, num);
  return 1;
}

function initVertexBuffers(gl) {
  let vertices = new Float32Array([
    0.0, 0.5, -0.5, -0.5, 0.5, -0.5
  ]);
  let n = 3;

  // 创建缓冲区对象
  const vertextBuffer = gl.createBuffer();
  if (!vertextBuffer) {
    console.log("无法创建缓冲区对象");
    return -1;
  }

  // 将缓冲区对象绑定到目标
  gl.bindBuffer(gl.ARRAY_BUFFER, vertextBuffer);

  // 向缓冲区对象中写入数据
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  let a_position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_position < 0) {
    console.log("无法获取attribute变量的存储位置");
    return -1;
  }

  // 将缓冲区对象分配给a_position变量
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);

  // 连接a_position变量与分配的缓冲区对象
  gl.enableVertexAttribArray(a_position);

  return n;
}