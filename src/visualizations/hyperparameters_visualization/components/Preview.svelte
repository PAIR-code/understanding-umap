<script>
  import { afterUpdate, onMount } from "svelte";
  import { getPoints, visualize } from "../../toy_visualization/js/visualize";

  export let points;
  export let onClick;
  export let selected;
  export let selectable = true;
  export let highlighted = false;

  let canvas;

  onMount(() => {
    visualize(points, canvas, null, null);
  });

  afterUpdate(() => {
    visualize(points, canvas, null, null);
  });
</script>

<style>
  .demo-data {
    cursor: pointer;
    position: relative;
    font-size: 10px;
    line-height: 1.2em;
    box-sizing: border-box;
    float: left;
    margin: 2px;
    padding: 4px;
    width: calc(33% - 4px);
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.08);
  }
  .demo-data.non-selectable {
    cursor: default;
  }

  @media (min-width: 480px) {
    .demo-data {
      padding: 8px;
      margin: 4px;
    }
  }
  @media (min-width: 768px) {
    .demo-data {
      padding: 8px;
      margin: 4px;
    }
  }
  .demo-data:hover {
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
  .demo-data.non-selectable:hover {
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
  .demo-data.selected::after {
    content: "";
    border: 2px solid rgba(70, 130, 180, 0.8);
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    border-radius: 4px;
  }
  .demo-data:hover canvas {
    opacity: 1;
  }
  .demo-data canvas {
    width: 100%;
    opacity: 0.3;
  }
  .demo-data.highlighted canvas {
    opacity: 1;
  }
  .demo-data.selected canvas {
    opacity: 1;
  }
</style>

<div
  class="demo-data {selected ? 'selected' : ''}
  {highlighted ? 'highlighted' : ''}
  {selectable ? '' : 'non-selectable'}"
  on:click={onClick}>
  <canvas bind:this={canvas} width={150} height={150} />
</div>
