/**
 * 当 Fabric.js 画布中的对象被选中时，对象的四周会出现一些小方框，我们可以选中方块进行缩放、旋转操作。
 * 这些被选中后出现的小方框被称为控制器 Controls
 */

// 创建 删除 控件
// 编写思路：1. 位置在右上角 2. 图形是一个红色小x 3. 点击弹窗提示是否删除，是的话就删掉。
const deleteControl = new fabric.Control({
  // 相对于中心点的偏移量，1指偏移一整个width
  x: 0.7,
  y: -0.7,
  sizeX: 30, // 控件的宽度
  sizeY: 30,
  cursorStyle: 'pointer',
  // 鼠标按下事件
  mouseDownHandler: (eventData, transform, x, y) => {
    if (confirm('确定删除？')) {
      canvas.remove(transform.target);
    }
    canvas.renderAll();
  },
  // 控件名字
  actionName: 'delete',
  // 自定义渲染
  render: function(ctx, left, top, styleOverride, fabricObject) {
    ctx.save();
    ctx.translate(left, top);
    ctx.fillStyle = 'red';
    ctx.font = '20px Arial';
    ctx.fillText('X', -10, 10); // 确保文字在控件的中心
    ctx.restore();
  }
});

// 将控件添加到圆的controls对象中
circle.controls.delete = deleteControl
