<script>
  import { afterUpdate } from "svelte";
  import kdTree from "kd-tree-javascript";
  import { scaleLinear } from "d3-scale";
  import { makeSine } from "../../../shared/js/sine";
  import Slider from "../../../shared/components/Slider.svelte";

  let canvas;
  let progress = 0;

  const width = 28;
  const height = 28;
  const nPixels = 28;

  afterUpdate(() => {
    const ctx = canvas.getContext("2d");

    const center = nPixels / 2;
    const lineDistance = nPixels * 2;

    ctx.fillStyle = "#000";
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;

    const output = [];
    // for (let i = 0; i < nLines; i++) {
    ctx.fillRect(0, 0, nPixels, nPixels);

    const angle = (Math.PI * progress) / 100;
    const dY = Math.sin(angle) * lineDistance;
    const dX = Math.cos(angle) * lineDistance;

    ctx.beginPath();
    ctx.moveTo(center - dX, center - dY);
    ctx.lineTo(center + dX, center + dY);
    ctx.stroke();

    const { data } = ctx.getImageData(0, 0, nPixels, nPixels);
    const pixelData = [];
    for (let j = 0; j < data.length; j += 4) {
      pixelData.push(data[j]);
    }
  });
</script>

<style>
  canvas {
    background-color: #fff;
    width: 100px;
    height: 100px;
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
    <label>progress: {progress}%</label>
    <Slider min={0} max={100} step={1} bind:value={progress} />
  </div>
</div>
