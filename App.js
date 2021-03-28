import "./styles.css";
import React, { useRef, useEffect } from 'react';

function App() {
  const canvas = useRef();
  let ctx = null;


  // initialize the canvas context
  useEffect(() => {
    // dynamically assign the width and height to canvas
    const canvasEle = canvas.current;
    canvasEle.width = 600;
    canvasEle.height = 400;
    // get context of the canvas
    ctx = canvasEle.getContext("2d");

  }, []);

  useEffect(() => {
    drawLine({ x: 20, y: 20, x1: 85, y1: 20 }, {color: 'black', width: 2 });
    drawLine({ x: 20, y: 60, x1: 70, y1: 60 }, {color: 'black', width: 2 });

    drawLine({ x: 70, y: 60, x1: 100, y1: 90 }, {color: 'black', width: 2 });
    drawLine({ x: 85, y: 20, x1: 140, y1: 75 }, {color: 'black', width: 2 });

    drawLine({ x: 100, y: 90, x1: 100, y1: 140 }, {color: 'black', width: 2 });
    drawLine({ x: 140, y: 75, x1: 140, y1: 145 }, {color: 'black', width: 2 });

    drawLine({ x: 100, y: 140, x1: 90, y1: 170 }, {color: 'black', width: 2 });
    drawLine({ x: 140, y: 145, x1: 130, y1: 175 }, {color: 'black', width: 2 });

    drawLine({ x: 90, y: 170, x1: 90, y1: 190 }, {color: 'black', width: 2 });
    drawLine({ x: 130, y: 175, x1: 130, y1: 190 }, {color: 'black', width: 2 });

    drawLine({ x: 90, y: 190, x1: 80, y1: 190 }, {color: 'black', width: 2 });
    drawLine({ x: 130, y: 190, x1: 140, y1: 190 }, {color: 'black', width: 2 });

    drawLine({ x: 80, y: 190, x1: 110, y1: 210 }, {color: 'black', width: 2 });
    drawLine({ x: 140, y: 190, x1: 110, y1: 210 }, {color: 'black', width: 2 });

    drawLine({ x: 250, y: 250, x1: 270, y1: 250 }, {color: 'black', width: 4 });
    drawLine({ x: 230, y: 250, x1: 250, y1: 250 }, {color: 'black', width: 1 });

    writeText({text: "0", x: 225, y: 240}, {fontSize: 12 });
    writeText({text: "1", x: 245, y: 240}, {fontSize: 12 });
    writeText({text: "2", x: 265, y: 240}, {fontSize: 12 });
  }, []);

  // draw a line
  const drawLine = (info, style = {}) => {
    const { x, y, x1, y1 } = info;
    const { color = 'black', width = 1 } = style;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }
  const writeText = (info, style = {}) => {
  const { text, x, y } = info;
  const { fontSize = 20} = style;

  ctx.beginPath();
  ctx.font = fontSize + 'px ';
  ctx.fillText(text, x, y);
  ctx.stroke();
}
  return (
    <div className="App">
      <canvas ref={canvas}></canvas>
    </div>
  );
}

export default App;
