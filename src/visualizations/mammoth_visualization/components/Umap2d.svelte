<script>
  import { afterUpdate, onMount } from "svelte";
  import Slider from "../../../shared/components/Slider.svelte";
  import Projection2d from "./Projection2d.svelte";

  const sliderWidth = 230;
  const neighbors = [3, 5, 10, 15, 20, 50, 100, 200];
  const dists = ["0.0", "0.1", "0.25", "0.5", "0.8", "0.99"];

  let canvas;
  let nNeighborsIndex = 3;
  let nNeighbors = neighbors[nNeighborsIndex];
  let distsIndex = 1;
  let minDist = dists[distsIndex];

  export let colorIndices;
  export let projections;
  export let title = "";
  export let times = null;

  const getKey = () => `n=${nNeighbors},d=${minDist}`;
  const getCurrentProjection = () => projections[getKey()];

  let projection = getCurrentProjection();

  afterUpdate(() => {
    nNeighbors = neighbors[nNeighborsIndex];
    minDist = dists[distsIndex];
    projection = getCurrentProjection();
  });
</script>

<style>
  .container {
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
  }

  .controls {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 6px;
  }

  .title {
    text-align: center;
    width: 100%;
    font-weight: bold;
    margin-bottom: 20px;
  }

  label {
    margin-right: 10px;
    width: 150px;
  }

  .label-text {
    font-weight: 600;
  }
</style>

<div class="container">
  {#if title}
    <div class="title">{title}</div>
  {/if}
  <Projection2d {projection} {colorIndices} />
  <div class="controls">
    <label class="label">
      <span class="label-text">n_neighbors:</span>
      {nNeighbors}
    </label>
    <div style="width: {sliderWidth}px">
      <Slider
        min={0}
        max={neighbors.length - 1}
        step={1}
        bind:value={nNeighborsIndex} />
    </div>
  </div>
  <div class="controls">
    <label class="label">
      <span class="label-text">min_dist:</span>
      {minDist}
    </label>
    <div style="width: {sliderWidth}px">
      <Slider min={0} max={dists.length - 1} step={1} bind:value={distsIndex} />
    </div>
  </div>
  {#if times}
    <div class="controls">
      <label class="label">
        <span class="label-text">time:</span>
        {times[nNeighborsIndex].t}
      </label>
      <div style="width: {sliderWidth}px" />
    </div>
  {/if}
</div>
