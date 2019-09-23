<script>
  import { onMount } from "svelte";
  import { loadData } from "../js/load-data";
  import { COLORS } from "../js/colors";
  import { ScatterGL } from "scatter-gl";

  let container;
  export let colorIndices;
  export let mammoth3d;
  export let title = "";

  onMount(async () => {
    const dataset = {
      dimensions: 3,
      points: mammoth3d,
      metadata: []
    };

    const styles = { fog: { enabled: false } };
    const scatterGL = new ScatterGL(container, {
      styles,
      selectEnabled: false
    });

    scatterGL.setPointColorer(i => {
      const colorIndex = colorIndices[i];
      return COLORS[colorIndex];
    });
    scatterGL.render(dataset);
  });
</script>

<style>
  .container {
    width: 45%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    margin-bottom: 20px;
  }

  .scatter-gl-container {
    width: 100%;
    min-height: 500px;
  }

  .title {
    text-align: center;
    width: 100%;
    font-weight: bold;
  }
</style>

<div class="container">
  {#if title}
    <div class="title">{title}</div>
  {/if}
  <div class="scatter-gl-container" bind:this={container} />
</div>
