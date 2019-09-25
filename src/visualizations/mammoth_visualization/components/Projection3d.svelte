<script>
  import { onMount } from "svelte";
  import { loadData } from "../js/load-data";
  import { COLORS } from "../js/colors";
  import { ScatterGL } from "scatter-gl";

  let container;
  let scatterGL;
  let isOrbiting = true;

  export let colorIndices;
  export let mammoth3d;
  export let title = "";

  const toggleOrbit = () => {
    isOrbiting = true;
    scatterGL.startOrbitAnimation();
  };

  onMount(async () => {
    const dataset = {
      dimensions: 3,
      points: mammoth3d,
      metadata: []
    };

    const onCameraMove = () => {
      if (isOrbiting) isOrbiting = false;
    };

    const styles = { fog: { enabled: false } };
    scatterGL = new ScatterGL(container, {
      styles,
      selectEnabled: false,
      onCameraMove
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
    position: relative;
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

  .orbit {
    position: absolute;
    bottom: 0;
    left: 0;
    cursor: pointer;
  }
  .orbit:hover {
    color: #333;
  }
</style>

<div class="container">
  {#if title}
    <div class="title">{title}</div>
  {/if}
  <div class="scatter-gl-container" bind:this={container} />
  {#if !isOrbiting}
    <div class="orbit" on:click={toggleOrbit}>
      <i class="material-icons">3d_rotation</i>
    </div>
  {/if}
</div>
