<script>
  import { onMount } from "svelte";
  import { loadData } from "../js/load-data";

  let container;
  let data;
  let metadata;
  let colorsByLabel;
  let isLoaded = false;
  let scatterGL;

  const onCategoryMouseOver = index => () => {
    scatterGL.setPointColorer(i => {
      const labelIndex = metadata[i].labelIndex;
      return labelIndex === index ? colorsByLabel[labelIndex] : "white";
    });
  };

  const setDefaultPointColorer = () => {
    scatterGL.setPointColorer(i => {
      const labelIndex = metadata[i].labelIndex;
      return colorsByLabel[labelIndex];
    });
  };

  onMount(async () => {
    data = await loadData();
    isLoaded = true;

    const dataPoints = [];
    metadata = [];
    data.projection.forEach((vector, index) => {
      const labelIndex = data.labels[index];
      dataPoints.push([vector[2], vector[0], vector[1]]);
      metadata.push({
        labelIndex,
        label: data.labelNames[labelIndex]
      });
    });

    const dataset = {
      dimensions: 3,
      points: dataPoints,
      metadata,
      spriteMetadata: {
        spriteImage: "fmnist_spritesheet.png",
        singleSpriteSize: [28, 28]
      }
    };

    colorsByLabel = [...new Array(10)].map((_, i) => {
      const hue = Math.floor((360 / 10) * i);
      return `hsl(${hue}, 100%, 50%)`;
    });

    scatterGL = new ScatterGL(container, {
      renderMode: "SPRITE",
      camera: { zoom: 2.0 },
      selectEnabled: false
    });
    setDefaultPointColorer();
    scatterGL.render(dataset);
  });
</script>

<style>
  .scatter-gl-container {
    width: 80%;
    min-height: 500px;
    float: left;
  }

  .categories {
    width: 20%;
    min-height: 500px;
    float: left;
  }

  .category {
    margin-bottom: 10px;
    padding: 10px;
    user-select: none;
    color: #333;
  }
</style>

<div class="scatter-gl-container" bind:this={container} />
<div class="categories">
  {#if isLoaded}
    {#each data.labelNames as labelName, labelIndex}
      <div
        class="category"
        style="background-color: {colorsByLabel[labelIndex]}"
        on:mouseover={onCategoryMouseOver(labelIndex)}>
        {labelName}
      </div>
    {/each}
  {/if}
</div>
