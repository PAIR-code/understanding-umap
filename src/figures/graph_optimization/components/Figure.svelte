<script>
  import { afterUpdate, onMount } from "svelte";
  import kdTree from "kd-tree-javascript";
  import { scaleLinear } from "d3-scale";
  import { makeSine } from "../../../shared/js/sine";
  import Slider from "../../../shared/components/Slider.svelte";
  import { UMAP } from "umap-js";

  const COLORS = [
    [44, 123, 182],
    [0, 166, 202],
    [0, 204, 188],
    [144, 235, 157]
  ];

  let canvas;
  let step = 0;
  let minDist = 0.1;
  let nNeighbors = 15;

  const width = 2048;
  const height = 1024;

  const colorScale = scaleLinear().range(COLORS);
  const POINT_RADIUS = 9;
  colorScale.domain(
    COLORS.map((_, i) => {
      return (i / (COLORS.length - 1)) * width;
    })
  );

  const points = makeSine(200, { width, height }, POINT_RADIUS).map(point => [
    point.x,
    point.y
  ]);
  const colors = points.map(point => colorScale(point[0]));

  const umap = new UMAP({
    nComponents: 1,
    nEpochs: 200,
    nNeighbors: 15,
    minDist: 0.2
  });
  umap.initializeFit(points);
  const optimizationSteps = [];

  onMount(() => {
    for (let i = 0; i < 200; i++) {
      umap.step();
      optimizationSteps.push(umap.getEmbedding().map(i => i[0]));
    }
  });

  afterUpdate(async () => {
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, width, height);
    // Draw the actual point
    points.forEach((point, i) => {
      const [x, y] = point;
      ctx.beginPath();
      ctx.arc(x, y, POINT_RADIUS, 0, 2 * Math.PI);
      const [r, g, b] = colors[i];
      ctx.fillStyle = `rgba(${r},${g},${b},1)`;
      ctx.fill();
    });

    const optimizationStep = optimizationSteps[step];
    let min = 0;
    let max = 0;
    optimizationStep.forEach(x => {
      min = x < min ? x : min;
      max = x > max ? x : max;
    });
    const range = max - min;
    optimizationStep.forEach((pointX, i) => {
      const x = ((pointX - min) / range) * width;
      const [r, g, b] = colors[i];
      ctx.fillStyle = `rgba(${r},${g},${b},1)`;
      ctx.fillRect(x, height - 10, 10, 10);

      ctx.strokeStyle = `rgba(${r},${g},${b},1)`;
      ctx.strokeWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, height - 5);
      ctx.lineTo(points[i][0], points[i][1]);
      ctx.stroke();
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
    margin-top: 6px;
  }

  label {
    margin-right: 10px;
    width: 200px;
  }
</style>

<div class="container">
  <canvas bind:this={canvas} {width} {height} />
  <div class="controls">
    <label>step: {step}</label>
    <Slider min={0} max={199} step={1} bind:value={step} />
  </div>
  <div class="controls">
    <label>nNearest: {nNeighbors}</label>
    <Slider min={5} max={30} step={1} bind:value={nNeighbors} />
  </div>
  <div class="controls">
    <label>minDist: {minDist}</label>
    <Slider min={0} max={1} step={0.01} bind:value={minDist} />
  </div>
</div>
