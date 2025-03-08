### A simple and powerful Javascript HTML5 canvas library

### Fabric.js能做的事情
- 在Canvas上创建、填充图形（包括图片、文字、规则图形和复杂路径组成图形）。
- 给图形填充渐变颜色。
- 组合图形（包括组合图形、图形文字、图片等）。
- 设置图形动画集用户交互。
- 生成JSON, SVG数据等。
- 生成Canvas对象自带拖拉拽功能

### canvas vs fabric.js
```
// canvas
//使用原生 canvas 方法。请记住，我们不能对对象 进行操作。相反，我们调整整个画布位图的位置和角度
var canvasEl = document.getElementById("canvas");
canvasEl.style.background = 'grey'
var ctx = canvasEl.getContext("2d");
ctx.fillStyle = 'red';
//偏移角度
ctx.translate(100,100);
ctx.rotate(Math.PI/180*45);
ctx.fillRect(-10,-10,20,20);
//位移，首先擦除先前绘制的内容，然后在新位置绘制矩形
ctx.strokeRect(100,100,20,20);
ctx.clearRect(0,0,canvasEl.width,canvasEl.height);
ctx.fillRect(20,50,20,20);


//fabric.js
//使用 Fabric，在尝试修改任何内容前，我们不再需要删除内容。我们仍然使用对象，只需更改其属性，然后重新渲染画布即可获得“新图片”
var canvas = new fabric.Canvas("canvas",{backgroundColor:"grey"});
var rect = new fabric.Rect({
  left:100,
  top:100,
  fill:"red",
  width:20,
  height:20,
  angle:45 //偏移角度
});
canvas.add(rect);
// 位移
rect.set({left:20,top:50});
canvas.renderAll()
```

### 调试
- http-server本地服务调试

### Demo
- index1.js
  1. 绘制图形拖动，缩放，旋转，捕获鼠标事件
  2. 插入文本，图像
  3. 导出SVG图片、序列化和反序列化
- index2.js
  1. 自由画布、橡皮擦
  2. 绘制路径，data.js为画笔序列化数据，反序列化渲染到画布上
- custom
  1. 自定义插件

### 文档
  - https://www.wenjiangs.com/doc/quick-get-start
  - https://fabricjs.com/api/classes/fabricimage/#fromurl
  - https://github.com/chenlogin/liam/blob/main/src/components/FabricCanvas.vue