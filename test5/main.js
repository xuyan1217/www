const aliceTumbling = [
  { transform: 'rotate(0) scale(1)' },
  { transform: 'rotate(360deg) scale(0)' }
];

const aliceTiming = {
  duration: 2000,
  iterations: 1,
  fill: 'forwards' // 保持在最后一帧状态，不再恢复
};

const aliceElements = document.querySelectorAll("#alice-container img");
const totalElements = aliceElements.length;

// 函数用于执行每三个元素的动画
function animateThreeElements(index) {
  // 检查是否有足够的元素来动画
  if (index + 2 < totalElements) {
    Promise.all([
      aliceElements[index].animate(aliceTumbling, aliceTiming).finished,
      aliceElements[index + 1].animate(aliceTumbling, aliceTiming).finished,
      aliceElements[index + 2].animate(aliceTumbling, aliceTiming).finished
    ]).then(() => {
      // 递归调用以动画下一组三个元素
      animateThreeElements(index + 3);
    }).catch(error => {
      console.error(`Error animating Alices: ${error}`);
    });
  }
}

// 从第一组三个元素开始动画
animateThreeElements(0);