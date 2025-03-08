/**
 * 将 Fabric 画布的 isDrawingMode 属性设置为 true ,画布上的任何进一步的单击和移动都被解释为铅笔/画笔。
 * 一旦执行任何移动，然后执行“ mouseup”事件，Fabric 就会触发“ path:created”事件，并实际上将刚刚绘制的形状转换为真实的 fabric.Path 实例。
 * 如果随时将 isDrawingMode 设置为 false，最终将在画布上仍然存在所有创建的路径对象。
 * 由于它们是 fabric.Path 对象，因此您可以根据需要进行任意修改（移动，旋转，缩放等）
 */
const free_drawing = new fabric.Canvas("free_drawing",
  {
    backgroundColor:"rgb(100,200,200)",
    isDrawingMode: false, // 默认关闭画笔
    selection: false, // 不允许群体选择
    preserveObjectStacking: true, // 不允许对象重叠
    skipOffscreen: true, // 不允许对象超出画布
    width: 600,
    height: 300
  });

// 反序列化，从JSON数据中加载画布状态，默认会完全替换画布的当前状态，包括背景色、叠加图像、剪辑路径等
free_drawing.loadFromJSON({"objects": hello.objects, "background": "rgb(100,200,200)"}, function() {
  // 重新渲染画布，lower-canvas、upper-canvas
  free_drawing.renderAll();
  // 新增双重渲染保证
  // 调用renderAll可能不足以立即更新视图，因为可能有些渲染操作被推迟到了下一个动画帧。
  requestAnimationFrame(() => {
    free_drawing.requestRenderAll();
  });
})

// 切换回画笔函数
function enablePencil() {
  const pencilBrush = new fabric.PencilBrush(free_drawing)
  free_drawing.freeDrawingBrush = pencilBrush
  free_drawing.isDrawingMode = true;
  free_drawing.freeDrawingBrush.color = '#FF6767'
  free_drawing.freeDrawingBrush.width = 3
}

function enableEraser() {
  //fabric.js 的基础包并没有包含橡皮擦模块，需要单独引入
  //两个方案
  //1、创建一个自定义画笔，通过绘制透明路径来模拟橡皮擦效果
  //2、使用 @erase2d/fabric 库中的 EraserBrush 画笔，https://www.npmjs.com/package/@erase2d/fabric
}

enablePencil()

setTimeout(() => {
  
}, 3000)