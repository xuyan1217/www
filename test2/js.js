// 获取画布元素
const canvas = document.querySelector('canvas');
// 获取画布的2D上下文
const ctx = canvas.getContext('2d');
// 设置画布的宽度和高度为窗口的宽度和高度
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
// 定义一个函数，用于生成指定范围内的随机数
function random(min,max) {
  // 生成一个指定范围内的随机数
  const num = Math.floor(Math.random() * (max - min)) + min;
  // 返回生成的随机数
  return num;
}
function randomColor() {
  // 生成一个随机颜色
  const color = 'rgb(' +
                random(0, 160) + ',' + // 生成一个0-255之间的随机数作为红色值
                random(0, 460) + ',' + // 生成一个0-255之间的随机数作为绿色值
                random(0, 450) + ')'; // 生成一个0-255之间的随机数作为蓝色值
  return color;
}
// 定义一个球类
function Ball(x, y, velX, velY, color, size) {
  // 球的横坐标
  this.x = x;
  // 球的纵坐标
  this.y = y;
  // 球的横向速度
  this.velX = velX;
  // 球的纵向速度
  this.velY = velY;
  // 球的颜色
  this.color = color;
  // 球的大小
  this.size = size;
}
// 定义Ball的原型方法draw，用于绘制小球
Ball.prototype.draw = function() {
  // 开始绘制路径
  ctx.beginPath();
  // 设置填充颜色为小球的颜色
  ctx.fillStyle = this.color;
  // 绘制圆形，参数为小球的x坐标、y坐标、半径、起始角度、结束角度
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  // 填充圆形
  ctx.fill();
};
// 更新球的位置
Ball.prototype.update = function() {
  // 如果球的x坐标加上球的大小大于等于画布的宽度
  if((this.x + this.size) > width) {
    // 将球的x速度取反，使球反弹
    this.velX = -(this.velX);
  }
 // 如果物体的x坐标减去物体的尺寸小于等于0，说明物体已经到达左边界
  if((this.x - this.size) <= 0) {
    // 将物体的x速度取反，使物体向右移动
    this.velX = -(this.velX);
  }
// 如果this.y + this.size的值大于等于height，则将this.velY的值取反
  // 如果物体的y坐标加上物体的大小大于等于画布的高度
  if((this.y + this.size) >= height) {
    // 将物体的y速度取反，实现物体的反弹效果
    this.velY = -(this.velY);
  }
  // 如果小球y坐标减去小球大小小于等于0，说明小球已经到达顶部
  if((this.y - this.size) <= 0) {
    // 将小球y方向的速度取反，使小球反弹
    this.velY = -(this.velY);
  }
  // 更新物体的x坐标
  this.x += this.velX;
  // 更新物体的y坐标
  this.y += this.velY;
};
// 定义碰撞检测函数
Ball.prototype.collisionDetect = function() {
  // 遍历所有球体
  for(let j = 0; j < balls.length; j++) {
    // 如果当前球体不是遍历到的球体
    if(this !== balls[j]) {
      // 计算两个球体之间的x轴距离
      const dx = this.x - balls[j].x;
      // 计算两个球体之间的y轴距离
      const dy = this.y - balls[j].y;
      // 计算两个球体之间的距离
      const distance = Math.sqrt(dx * dx + dy * dy);

      // 如果两个球体之间的距离小于两个球体的大小之和
      if (distance < this.size + balls[j].size) {
        // 交换两个球体的颜色
        balls[j].color = this.color = randomColor();
      }
    }
  }
};
// 定义一个空数组balls
let balls = [];
while(balls.length < 221) {
  const size = random(1,17);
  // 创建一个球对象，参数为随机位置、随机速度、随机颜色和大小
  let ball = new Ball(
    // 为避免绘制错误，球至少离画布边缘球本身一倍宽度的距离
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomColor(),
    size
  );
  // 将球对象添加到balls数组中
  balls.push(ball);
}
// 定义一个循环函数
function loop() {
  // 设置填充颜色为半透明的黑色
  ctx.fillStyle = 'black';
  // 在画布上绘制一个矩形，覆盖整个画布
  ctx.fillRect(0,0,width,height);

  // 遍历balls数组中的每一个元素
  for(let i = 0; i < balls.length; i++) {
    // 绘制每一个球
    balls[i].draw();
    // 更新每一个球的位置
    balls[i].update();
    // 检测每一个球的碰撞
    balls[i].collisionDetect();
  }

  // 请求下一帧动画
  requestAnimationFrame(loop);
}

// 调用循环函数
loop();
