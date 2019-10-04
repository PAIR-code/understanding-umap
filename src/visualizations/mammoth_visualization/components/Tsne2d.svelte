<script>
  import { afterUpdate, onMount } from "svelte";
  import Slider from "../../../shared/components/Slider.svelte";
  import { TSNE_MAMMOTH_PERPLEXITIES } from "../../../shared/js/parameters";
  import Projection2d from "./Projection2D.svelte";

  // prettier-ignore
  const perplexities = [...TSNE_MAMMOTH_PERPLEXITIES];

  let canvas;
  let perplexityIndex = 4;
  let perplexity = perplexities[perplexityIndex];

  export let colorIndices;
  export let projections;
  export let title = "";

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
    box-sizing: border-box;
  }

  .controls {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .title {
    text-align: center;
    width: 100%;
    font-weight: bold;
    margin-bottom: 20px;
  }

  label {
    margin-right: 10px;
    width: 200px;
  }
</style>

<div class="container">
  {#if title}
    <div class="title">{title}</div>
  {/if}
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
