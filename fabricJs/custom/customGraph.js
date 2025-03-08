/**
 * initialize : 添加的自定义属性方法放这
 * toObject: 将自定义属性添加到序列化对象中，方便canvas记录
 * _render: 处理自定义渲染逻辑
 */
// 创建一个自定义子类
const Map = fabric.util.createClass(fabric.Object, {
  type: "Map",
  initialize: function (options) {
    options || (options = {});
    this.callSuper("initialize", options);
    this.set("gridNumX", options.gridNumX || "");
    this.set("gridNumY", options.gridNumY || "");
  },

  toObject: function () {
    return fabric.util.object.extend(this.callSuper("toObject"), {
      gridNumX: this.get("gridNumX"),
      gridNumY: this.get("gridNumY"),
    });
  },

  _render: function (ctx) {
    this.callSuper("_render", ctx);
    initMap({
      ...this
    }, ctx)
  },
});

/* 
  绘制网格横竖线map
*/
function initMap(options, ctx) {
  const { gridNumX, gridNumY, width, height, fill, left, top } = options;
  ctx.save();
  ctx.translate(-width / 2, -height / 2)
  // 开始路径并绘制线条
  ctx.beginPath();
  // 设置线条样式
  ctx.lineWidth = 1;
  ctx.strokeStyle = fill;
  // 开始绘制横线
  for (let i = 0; i < gridNumY + 1; i++) {
    // 注意要算线的宽度，也就是后面那个+i
    ctx.moveTo(0, height / gridNumY * i);
    ctx.lineTo(width, height / gridNumY * i);
    ctx.stroke();
  }
  // 开始绘制竖线
  for (let i = 0; i < gridNumX + 1; i++) {
    ctx.moveTo(width / gridNumX * i, 0);
    ctx.lineTo(width / gridNumX * i, height);
    ctx.stroke();
  }
  ctx.restore();
}

// 新建 map 实例并添加到canvas
const map = new Map({
  left: 100,
  top: 100,
  label: "test",
  fill: "#faa",
  width: 100,
  height: 100,
  gridNumX: 4,
  gridNumY: 3
});

const map2 = new Map({
  left: 300,
  top: 100,
  label: "test",
  fill: "green",
  width: 200,
  height: 300,
  gridNumX: 2,
  gridNumY: 5
});
// 将所有图形添加到 canvas 中
canvas.add(map, map2);

  
