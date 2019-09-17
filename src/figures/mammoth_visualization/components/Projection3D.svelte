<script>
  import { onMount } from "svelte";
  import { loadData } from "../js/data";
  import { COLORS } from "../js/colors";

  let container;
  export let labelOffsets;
  export let mammoth3D;

  onMount(async () => {
    const colorIndices = labelOffsets;

    const dataset = {
      dimensions: 3,
      points: mammoth3D,
      metadata: []
    };

    const styles = { fog: { enabled: false } };
    const scatterGL = new ScatterGL(container, { styles });

    const colorArray = [];
    let colorIndex = -1;
    let nColorPoints = 0;
    for (let i = 0; i < mammoth3D.length; i++) {
      if (i >= nColorPoints) {
        colorIndex += 1;
        nColorPoints += labelOffsets[colorIndex];
      }
      colorArray.push(colorIndex);
    }

    scatterGL.setPointColorer(i => {
      const colorIndex = colorArray[i];
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
