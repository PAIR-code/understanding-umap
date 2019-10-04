<script>
  import { onMount, forceUpdate } from "svelte";
  import { loadData } from "../js/load-data";
  import { ScatterGL } from "scatter-gl";
  import Color from "color";

  let container;
  let data;
  let metadata;
  let colorsByLabel;
  let isLoaded = false;
  let isUmapProjection = true;
  let selectedLabelIndices = new Set();
  let scatterGL;

  let umapDataset;
  let tsneDataset;

  let isOrbiting = true;

  const onPointClick = i => {
    const labelIndex = i === null ? null : metadata[i].labelIndex;
    onCategoryClick(labelIndex)();
  };

  window._selectFmnistLabel = (e, label) => {
    const labelIndex = data.labelNames.findIndex(l => {
      return l.toLowerCase() === label;
    });
    if (labelIndex !== -1) {
      onCategoryClick(labelIndex)(e);
    }
  };

  const onCategoryClick = index => e => {
    if (e && e.shiftKey) {
      selectedLabelIndices.add(index);
    } else {
      selectedLabelIndices.clear();
    }
    if (index !== null) {
      selectedLabelIndices.add(index);
    }

    // Necessary to force a rerender of the category labels
    selectedLabelIndices = selectedLabelIndices;

    if (selectedLabelIndices.size === 0) return setDefaultPointColorer();
    scatterGL.setPointColorer(i => {
      const labelIndex = metadata[i].labelIndex;
      return selectedLabelIndices.has(labelIndex)
        ? colorsByLabel[labelIndex].string()
        : "white";
    });
  };

  const setDefaultPointColorer = () => {
    scatterGL.setPointColorer(i => {
      const labelIndex = metadata[i].labelIndex;
      return colorsByLabel[labelIndex].string();
    });
  };

  const getBackgroundColor = (labelIndex, selectedLabelIndices) => {
    const isSelected = selectedLabelIndices.has(labelIndex);
    const noneSelected = selectedLabelIndices.size === 0;
    const color = colorsByLabel[labelIndex];
    return isSelected || noneSelected
      ? color.string()
      : color.lighten(0.35).string();
  };

  const toggleUmapSelected = umapSelected => () => {
    isUmapProjection = umapSelected;
    if (isUmapProjection) {
      scatterGL.updateDataset(umapDataset);
    } else {
      scatterGL.updateDataset(tsneDataset);
    }
  };

  const toggleOrbit = () => {
    isOrbiting = true;
    scatterGL.startOrbitAnimation();
  };

  onMount(async () => {
    data = await loadData();
    isLoaded = true;

    metadata = [];
    const umapPoints = [];
    const tsnePoints = [];

    data.umapProjection.forEach((vector, index) => {
      const labelIndex = data.labels[index];
      umapPoints.push([vector[2], vector[0], vector[1]]);
      const tsneVector = data.tsneProjection[index];
      tsnePoints.push(tsneVector);
      metadata.push({
        labelIndex,
        label: data.labelNames[labelIndex]
      });
    });

    const dataset = {
      dimensions: 3,
      metadata,
      spriteMetadata: {
        spriteImage: "spritesheet.png",
        singleSpriteSize: [28, 28]
      }
    };

    umapDataset = {
      ...dataset,
      points: umapPoints
    };

    tsneDataset = {
      ...dataset,
      points: tsnePoints
    };

    colorsByLabel = [...new Array(10)].map((_, i) => {
      let hue = Math.floor((360 / 10) * i);
      return new Color({ h: hue, s: 100, l: 70 });
    });

    const onCameraMove = () => {
      if (isOrbiting) isOrbiting = false;
    };

    scatterGL = new ScatterGL(container, {
      renderMode: "SPRITE",
      camera: { zoom: 1.3 },
      selectEnabled: false,
      onClick: onPointClick,
      onCameraMove
    });
    setDefaultPointColorer();
    scatterGL.render(umapDataset);
  });
</script>

<style>
  .container {
    position: relative;
    width: 100%;
    min-height: 500px;
  }

  .scatter-gl-container {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }

  .categories {
    height: 100%;
    width: 20%;
    position: absolute;
    right: 0;
  }

  .category {
    cursor: pointer;
    margin-bottom: 10px;
    padding: 8px;
    user-select: none;
    color: #333;
  }

  .category.selected {
    font-weight: 800;
  }

  .category:hover {
    text-decoration: underline;
  }

  .projection-types {
    position: absolute;
    top: 0;
    left: 0;
    width: 150px;
    flex-direction: column;
  }

  .projection-type {
    cursor: pointer;
    background-color: aliceblue;
    margin-bottom: 10px;
    padding: 8px;
    user-select: none;
  }

  .projection-type:hover {
    text-decoration: underline;
  }

  .projection-type.selected {
    font-weight: 900;
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
  <div class="scatter-gl-container" bind:this={container} />
  <div class="projection-types">
    <div
      class="projection-type {isUmapProjection ? 'selected' : ''}"
      on:click={toggleUmapSelected(true)}>
      UMAP
    </div>
    <div
      class="projection-type {isUmapProjection ? '' : 'selected'}"
      on:click={toggleUmapSelected(false)}>
      t-SNE
    </div>
  </div>
  <div class="categories">
    {#if isLoaded}
      <div
        class="category {selectedLabelIndices.size === 0 ? 'selected' : ''}"
        style="background-color: aliceblue"
        on:click={onCategoryClick(null)}>
        All
      </div>
      {#each data.labelNames as labelName, labelIndex}
        <div
          class="category {selectedLabelIndices.has(labelIndex) ? 'selected' : ''}"
          style="background-color: {getBackgroundColor(labelIndex, selectedLabelIndices)}"
          on:click={onCategoryClick(labelIndex)}>
          {labelName}
        </div>
      {/each}
    {/if}
  </div>
  {#if !isOrbiting}
    <div class="orbit" on:click={toggleOrbit}>
      <i class="material-icons">3d_rotation</i>
    </div>
  {/if}
</div>
