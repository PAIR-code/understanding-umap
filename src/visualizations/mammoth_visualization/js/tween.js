const easeInOutQuad = t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
const TWEEN_DURATION = 500;

const deepCopy2D = vector => vector.map(([x, y]) => [x, y]);

export class Tween {
  constructor(
    current,
    callback,
    easingFn = easeInOutQuad,
    tweenDuration = TWEEN_DURATION
  ) {
    // Deep copy of the 2D coordinates
    this.current = deepCopy2D(current);
    this.end = deepCopy2D(current);
    this.callback = callback;
    this.easingFn = easingFn;
    this.tweenDuration = tweenDuration;
    this.isActive = false;
    this.percent = 1;
    this.onAnimationFrame = this.onAnimationFrame.bind(this);
  }

  beginTween(next) {
    this.start = deepCopy2D(this.current);
    this.end = deepCopy2D(next);
    this.isActive = true;

    this.startTime = Date.now();
    requestAnimationFrame(this.onAnimationFrame);
  }

  applyTween() {
    this.current = this.current.map((_, i) => {
      const [startX, startY] = this.start[i];
      const [endX, endY] = this.end[i];
      const x = (endX - startX) * this.percent + startX;
      const y = (endY - startY) * this.percent + startY;
      return [x, y];
    });
  }

  onAnimationFrame() {
    const timeElapsed = Date.now() - this.startTime;
    const percentTime = Math.min(1, timeElapsed / this.tweenDuration);

    this.percent = this.easingFn(percentTime);
    if (this.percent === 1) this.isActive = false;

    this.applyTween();
    this.callback(this.current, this.isActive, this.percent);

    if (this.isActive) {
      requestAnimationFrame(this.onAnimationFrame);
    }
  }
}
