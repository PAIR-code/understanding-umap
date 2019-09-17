<script>
  import { afterUpdate } from "svelte";
  import kdTree from "kd-tree-javascript";
  import { scaleLinear } from "d3-scale";
  import { Random } from "../../../shared/js/random";
  import Slider from "../../../shared/components/Slider.svelte";

  const COLORS = [
    [44, 123, 182],
    [0, 166, 202],
    [0, 204, 188],
    [144, 235, 157]
  ];
  const colorScale = scaleLinear().range(COLORS);
  const POINT_RADIUS = 9;

  let canvas;
  let progress = 0;

  const width = 2048;
  const height = 1024;
  const nPoints = 100;
  const nNearest = 3;

  colorScale.domain(
    COLORS.map((_, i) => {
      return (i / (COLORS.length - 1)) * width;
    })
  );

  const random = new Random(42);
  const constrain = (n, max, min = 0) => Math.max(Math.min(n, max), min);

  // construct some data in a specific shape
  const points = [];
  const getRandom = x => Math.floor(x * random.nextFloat());
  const getRandomPoint = () => ({ x: getRandom(width), y: getRandom(height) });
  const getSinePoint = () => {
    let x = getRandom(width);
    let y = (Math.sin((x / width) * 6 * Math.PI) * height) / 4 + height / 2;
    y = y + getRandom(height / 5) * (random.nextFloat() > 0.5 ? 1 : -1);
    return {
      x: constrain(x, width - POINT_RADIUS, POINT_RADIUS),
      y: constrain(y, height - POINT_RADIUS, POINT_RADIUS)
    };
  };
  for (let i = 0; i < nPoints; i++) {
    const getPoint = getSinePoint;
    // const getPoint = getRandomPoint;
    const point = getPoint();
    points.push({ ...point, index: i });
  }

  // Precompute all radius intersections
  const distanceFn = (a, b) =>
    Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  const tree = new kdTree.kdTree([...points], distanceFn, ["x", "y"]);
  const nearestEntries = points.map(point => {
    const entries = tree.nearest(point, nNearest + 1);
    const sorted = entries.sort((a, b) => a[1] - b[1]).slice(1, nNearest + 1);
    return sorted.map(entry => {
      const point = entry[0];
      const { x, y, index } = point;
      return { point: { x, y }, index, distance: entry[1] };
    });
  });
  const distances = nearestEntries.map(e => e.map(f => f.distance));
  const maxDistances = distances.map(d => d[d.length - 1]);

  const nearestRadii = points.map((point, i) => {
    const fromPointToFurthest = maxDistances[i];
    const fromPointToNearest = distances[i][0];

    const j = nearestEntries[i][0].index;
    const fromNearestToItsFurthest = maxDistances[j];
    const fromNearestToItsNearest = distances[j][0];

    if (fromPointToNearest > fromNearestToItsNearest) {
      const k = nearestEntries[j][0].index;
      const fromNearestNearestToItsFurthest = maxDistances[k];
      const percentFromNearestToNearest =
        fromNearestToItsNearest /
        (fromNearestToItsFurthest + fromNearestNearestToItsFurthest);
      const nearestRadius =
        fromNearestToItsFurthest * percentFromNearestToNearest;
      return fromPointToNearest - nearestRadius;
    } else {
      const percentFromPointToNearest =
        fromPointToNearest / (fromPointToFurthest + fromNearestToItsFurthest);
      return percentFromPointToNearest * fromPointToFurthest;
    }
  });
  const colors = points.map(point => {
    return colorScale(point.x);
  });

  afterUpdate(async () => {
    const ctx = canvas.getContext("2d");
    const percent = progress / 100;

    ctx.clearRect(0, 0, width, height);
    // Draw the actual point
    points.forEach((point, i) => {
      const { x, y } = point;
      ctx.beginPath();
      ctx.arc(x, y, POINT_RADIUS, 0, 2 * Math.PI);
      const [r, g, b] = colors[i];
      ctx.fillStyle = `rgba(${r},${g},${b},1)`;
      ctx.fill();
    });

    // Draw the fuzzy radius past the first neighbor
    points.forEach((point, i) => {
      const { x, y } = point;
      const nearestRadius = nearestRadii[i];
      const maxRadius = maxDistances[i];
      const radius = maxRadius * percent;

      const [r, g, b] = colors[i];
      const start = `rgba(${r},${g},${b},0.2)`;
      const end = `rgba(${r},${g},${b},0.0)`;

      // prettier-ignore
      const gradient = ctx.createRadialGradient(x, y, nearestRadius, x, y, maxRadius * 0.85);
      gradient.addColorStop(0, start);
      gradient.addColorStop(1, end);

      // Fill outer circle with gradient
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Fill inner circle again
      ctx.beginPath();
      const innerRadius = Math.min(radius, nearestRadius);
      ctx.arc(x, y, innerRadius, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(${r},${g},${b},0.2)`;
      ctx.fill();
    });

    // Draw the connections between points
    points.forEach((point, i) => {
      const { x, y } = point;
      const maxDistance = maxDistances[i];
      const r = maxDistance * percent;

      const nearest = nearestEntries[i];
      for (const entry of nearest) {
        const { point: other, index: otherIndex, distance } = entry;
        const otherR = maxDistances[otherIndex] * percent;

        if (distance <= r + otherR) {
          const fraction = distance / maxDistance;
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(other.x, other.y);
          ctx.lineWidth = 2 + 5 * (1 - fraction);
          const [r, g, b] = colors[i];
          const color = `rgba(${r},${g},${b},${1 - 0.5 * fraction})`;
          ctx.strokeStyle = color;
          ctx.stroke();
        }
      }
    });
  });
</script>

<style>
  canvas {
    background-color: #fff;
    width: 100%;
    margin-bottom: 20px;
  }

  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .controls {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  label {
    margin-right: 10px;
    width: 200px;
  }
</style>

<div class="container">
  <canvas bind:this={canvas} {width} {height} />
  <div class="controls">
    <label>progress: {progress}%</label>
    <Slider min={0} max={100} step={1} bind:value={progress} />
  </div>
</div>
