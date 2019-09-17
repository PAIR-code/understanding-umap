<script>
  import { afterUpdate, onMount } from "svelte";
  import Slider from "../../../shared/components/Slider.svelte";
  import { COLORS } from "../js/colors";
  import { loadData } from "../js/load-data";
  import { Tween } from "../js/tween";
  import { render2d } from "../js/render";

  const neighbors = [2, 5, 10, 15, 20, 50, 100, 200];
  const dists = ["0.0", "0.1", "0.25", "0.5", "0.8", "0.99"];

  let canvas;
  let nNeighborsIndex = 3;
  let nNeighbors = neighbors[nNeighborsIndex];
  let distsIndex = 1;
  let minDist = dists[distsIndex];

  export let colorIndices;
  export let projections2D;

  const getKey = () => `n=${nNeighbors},d=${minDist}`;
  const getCurrentProjection = () => projections2D[getKey()];

  const width = 1024;
  const height = 1024;

  const tweenCallback = (projection, isActive, percent) => {
    const dimensions = { width, height };
    render2d(canvas, dimensions, projection, colorIndices);
  };

  const initialPoints = getCurrentProjection();
  const tween = new Tween(initialPoints, tweenCallback);

  afterUpdate(() => {
    nNeighbors = neighbors[nNeighborsIndex];
    minDist = dists[distsIndex];
    const nextProjection = getCurrentProjection();
    tween.beginTween(nextProjection);
  });
</script>

<style>
  canvas {
    background-color: #fff;
    width: 100%;
    margin-bottom: 20px;
  }

  .container {
    width: 55%;
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
  <canvas bind:this={canvas} width={1024} height={1024} />
  <div class="controls">
    <label class="label">nNeighbors: {nNeighbors}</label>
    <Slider
      min={0}
      max={neighbors.length - 1}
      step={1}
      bind:value={nNeighborsIndex} />
  </div>
  <div class="controls">
    <label class="label">minDist: {minDist}</label>
    <Slider min={0} max={dists.length - 1} step={1} bind:value={distsIndex} />
  </div>
</div>
