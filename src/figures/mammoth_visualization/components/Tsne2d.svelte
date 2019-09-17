<script>
  import { afterUpdate, onMount } from "svelte";
  import Slider from "../../../shared/components/Slider.svelte";
  import Projection2d from "./Projection2D.svelte";

  const perplexities = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

  let canvas;
  let perplexityIndex = 5;
  let perplexity = perplexities[perplexityIndex];

  export let colorIndices;
  export let projections;

  const getKey = () => `p=${perplexity}`;
  const getCurrentProjection = () => projections[getKey()];

  let projection = getCurrentProjection();

  afterUpdate(() => {
    perplexity = perplexities[perplexityIndex];
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
  <Projection2d {projection} {colorIndices} />
  <div class="controls">
    <label class="label">perplexity: {perplexity}</label>
    <Slider
      min={0}
      max={perplexities.length - 1}
      step={1}
      bind:value={perplexityIndex} />
  </div>
</div>
