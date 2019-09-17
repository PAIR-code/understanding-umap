<script>
  import { onMount } from "svelte";
  import { loadData } from "../js/load-data";
  import { COLORS } from "../js/colors";

  let container;
  export let colorIndices;
  export let mammoth3d;

  onMount(async () => {
    const dataset = {
      dimensions: 3,
      points: mammoth3d,
      metadata: []
    };

    const styles = { fog: { enabled: false } };
    const scatterGL = new ScatterGL(container, { styles });

    scatterGL.setPointColorer(i => {
      const colorIndex = colorIndices[i];
      return COLORS[colorIndex];
    });
    scatterGL.render(dataset);
  });
</script>

<style>
  .scatter-gl-container {
    width: 45%;
    min-height: 500px;
  }
</style>

<div class="scatter-gl-container" bind:this={container} />
