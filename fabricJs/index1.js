console.log('Fabric version:', fabric.version);
// 不需要图形交互层 fabric.StaticCanvas
const canvas = new fabric.Canvas("canvas",{backgroundColor:"grey"});
//设置不能群体选择
canvas.selection = false;

// 绘制规则图形
// fabric.Circle
// fabric.Ellipse
// fabric.Line
// fabric.Polygon
// fabric.Polyline
// fabric.Rect
// fabric.Triangle
const rect = new fabric.Rect({
  left:50,//距离画布左侧的距离，单位是像素
  top:50,//距离画布上边的距离
  fill:'red',//填充的颜色
  width:30,//方形的宽度
  height:30//方形的高度
});
/**
 * after:render：画布重绘后
 * object:selected：对象被选中
 * object:moving：对象移动
 * object:rotating：对象被旋转
 * object:added：对象被加入
 * object:removed：对象被移除
 */
rect.on('selected', function() {//选中监听事件
  console.log('selected a rectangle');
});
canvas.add(rect);
rect.set({strokeWidth:5,stroke:"rgba(100,200,200,0.5)"});
console.log('rect.get("width")', rect.get("width"));


// 绘制不规则图形
// M代表“移动”、L代表“线”、 “z” 代表让图形闭合路径
// fabric.loadSVGFromString 或 fabric.loadSVGFromURL 方法之类的方法来加载整个 SVG 文件
// 让 Fabric 的 SVG 解析器完成遍历所有 SVG 元素并创建相应的 Path 对象的工作
const path = new fabric.Path('M 0 0 L 200 100 L 170 200 z');
path.set({ left: 100, top: 50,fill:'red' });
canvas.add(path);

// 插入图片
// const imgElement = document.getElementById('img');   
// var imgInstance = new fabric.Image(imgElement,{
//   left:100,
//   top:100,
//   scaleX: 0.1,  // 用缩放系数代替固定宽高
//   scaleY: 0.1,
//   angle:30 // 图形顺时针旋转角度
// });
// canvas.add(imgInstance);//加入到canvas中

// 插入图片（推荐方式）
const Img = fabric.Image.fromURL('./img/vue.png', {
  crossOrigin: 'anonymous'
})
.then(img => {
  img.set({
    left: 100,
    top: 100,
    scaleX: 0.1,
    scaleY: 0.1,
    angle: 30
  });
  canvas.add(img);
  // 插入图片后，再执行其他操作
  // exportImage()
})
.catch(error => console.error('图片加载失败:', error));

//组合对象
var circle = new fabric.Circle({ //绘制圆形
  radius: 100,
  fill: '#f00',
  scaleY: 0.5,
  originX: 'center', //调整中心点的X轴坐标
  originY: 'center' //调整中心点的Y轴坐标
});
//绘制可编辑文本 fabric.IText
var text = new fabric.Text('Hello World', { //绘制文本
  fontSize: 30,
  originX: 'center',
  originY: 'center'
})
var group = new fabric.Group([circle, text], {
  left: 150,
  top: 100,
  angle: 10
})
canvas.add(group);

// 监听事件
canvas.on('mouse:down', function(options) {
  // 点击点在 canvas 中的位置 e.pointer/{e.e.offsetX,e.e.offsetY}
  // 点击点在页面中的位置 {e.e.clientX,e.e.clientY}/{e.e.pageX,e.e.pageY}
  // 点击点在对象中的位置 {e.transform.offsetX,e.transform.offsetY}
  console.log(options.e.clientX, options.e.clientY)
})
canvas.on('mouse:move', function(options) {
  // console.log('move')
})
canvas.on('mouse:up', function(options) {
  console.log('up')
})

//序列化，允许用户将画布内容的结果保存在服务器上，或将内容流式传输到其他客户端
// toObject（） 和 toJSON（） 方法可以将画布内容序列化为 JSON 字符串
// toJSON 输出本质上是一个字符串化的 toObject 输出
// 仍然要发送画布内容也是可以的，有一个选项可以将画布导出到图像中
const canvasToJSON = JSON.stringify(canvas.toJSON());
const canvasToDataURL = canvas.toDataURL('png');

function exportImage() {
  const dataURL = canvas.toDataURL({
    format: 'png', // 图片格式
    quality: 1, // 图片质量
    multiplier: 2, // 图片放大倍数
    left: 0, // 裁剪区域左上角x坐标
    top: 0, // 裁剪区域左上角y坐标
    width: canvas.width, // 裁剪区域宽度
    height: canvas.height, // 裁剪区域高度
    cropX: 0, // 裁剪导出图片的起始 X 坐标
    cropY: 0, // 裁剪导出图片的起始 Y 坐标
    cropWidth: canvas.width, // 裁剪导出图片的裁剪宽度
    cropHeight: canvas.height // 裁剪导出图片的裁剪高度
  })
  // 创建下载链接
  let downloadLink = document.createElement('a');
  downloadLink.href = dataURL;
  downloadLink.download = 'canvas-image.jpg';
  downloadLink.click();
}

// 反序列化
// canvas.loadFromJSON({"objects":[
//   {"type":"rect","left":50,"top":50,"width":20,"height":20,"fill":"green","background":"grey"}
// ]})

//toSVG，插入图片是异步，生成的SVG不包含图片
//使用 toSVG 导出，导入使用 fabric.loadSVGFromURL 或 fabric.loadSVGFromString 方法
canvas.toSVG();

//数据量很大时，toDatalessJSON、loadFromDatalessJSON