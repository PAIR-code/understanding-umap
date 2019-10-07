<script>
  import { afterUpdate, onMount } from "svelte";
  import Slider from "../../../shared/components/Slider.svelte";
  import { TSNE_MAMMOTH_PERPLEXITIES } from "../../../shared/js/parameters";
  import Projection2d from "./Projection2D.svelte";

  const sliderWidth = 230;
  // prettier-ignore
  const perplexities = [...TSNE_MAMMOTH_PERPLEXITIES];

  let canvas;
  let perplexityIndex = 4;
  let perplexity = perplexities[perplexityIndex];

  export let colorIndices;
  export let projections;
  export let title = "";
  export let times = null;

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
      <span class="label-text">perplexity:</span>
      {perplexity}
    </label>
    <div style="width: {sliderWidth}px">
      <Slider
        min={0}
        max={perplexities.length - 1}
        step={1}
        bind:value={perplexityIndex} />
    </div>
  </div>
  {#if times}
    <div class="controls">
      <label class="label">
        <span class="label-text">time:</span>
        {times[perplexityIndex].t}
      </label>
      <div style="width: {sliderWidth}px" />
    </div>
  {/if}
</div>
