import { Random } from "./random";

const random = new Random(112);
const constrain = (n, max, min = 0) => Math.max(Math.min(n, max), min);
const getRandom = x => Math.floor(x * random.nextFloat());
const getRandomPoint = () => ({
  x: getRandom(width),
  y: getRandom(height)
});
const getSinePoint = (width, height, pointRadius) => {
  let x = getRandom(width);
  let y = (Math.sin((x / width) * 6 * Math.PI) * height) / 4 + height / 2;
  y = y + getRandom(height / 5) * (random.nextFloat() > 0.5 ? 1 : -1);
  return {
    x: constrain(x, width - pointRadius, pointRadius),
    y: constrain(y, height - pointRadius, pointRadius)
  };
};

export function makeSine(nPoints, dimensions, pointRadius = 5) {
  const { width, height } = dimensions;

  const points = [];
  for (let i = 0; i < nPoints; i++) {
    const point = getSinePoint(width, height, pointRadius);
    points.push({ ...point, index: i });
  }

  return points;
}
