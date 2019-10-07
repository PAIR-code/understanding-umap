import { COLORS } from "../js/colors";

export function render2d(canvas, dimensions, points, colorIndices) {
  const { width, height } = dimensions;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    const [x, y] = point;
    const colorIndex = colorIndices[i];

    ctx.fillStyle = COLORS[colorIndex];
    ctx.fillRect(x, y, 3, 3);
  }
}
