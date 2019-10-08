<script>
  import { onMount, forceUpdate } from "svelte";
  import { loadData } from "../js/load-data";
  import { ScatterGL } from "scatter-gl";
  import Color from "color";

  let umapContainer;
  let tsneContainer;

  let umapScatterGL;
  let tsneScatterGL;

  let umapDataset;
  let tsneDataset;

  let data;
  let metadata;
  let colorsByLabel;
  let isLoaded = false;
  let selectedLabelIndices = new Set();

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
      if (selectedLabelIndices.has(index) || index === null) {
        selectedLabelIndices.clear();
      } else {
        selectedLabelIndices.clear();
        selectedLabelIndices.add(index);
      }
    }

    // Necessary to force a rerender of the category labels
    selectedLabelIndices = selectedLabelIndices;

    if (selectedLabelIndices.size === 0) return setDefaultPointColorer();

    [umapScatterGL, tsneScatterGL].forEach(scatterGl => {
      scatterGl.setPointColorer(i => {
        const labelIndex = metadata[i].labelIndex;
        return selectedLabelIndices.has(labelIndex)
          ? colorsByLabel[labelIndex].string()
          : "white";
      });
    });
  };

  const setDefaultPointColorer = () => {
    [umapScatterGL, tsneScatterGL].forEach(scatterGl => {
      scatterGl.setPointColorer(i => {
        const labelIndex = metadata[i].labelIndex;
        return colorsByLabel[labelIndex].string();
      });
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

  const toggleOrbit = () => {
    isOrbiting = true;
    [umapScatterGL, tsneScatterGL].forEach(scatterGl => {
      scatterGl.startOrbitAnimation();
    });
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

    const scatterGLOptions = {
      renderMode: "SPRITE",
      selectEnabled: false,
      onClick: onPointClick,
      onCameraMove
    };

    umapScatterGL = new ScatterGL(umapContainer, {
      ...scatterGLOptions,
      camera: { zoom: 1.2 }
    });
    tsneScatterGL = new ScatterGL(tsneContainer, {
      ...scatterGLOptions,
      camera: { zoom: 0.9 }
    });
    setDefaultPointColorer();
    umapScatterGL.render(umapDataset);
    tsneScatterGL.render(tsneDataset);
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
    position: absolute;
    top: 0;
  }

  .umap-container {
    left: 0;
    width: 55%;
  }

  .tsne-container {
    right: 0;
    width: 45%;
  }

  .categories {
    width: 100%;
    position: absolute;
    display: flex;
    flex-direction: row;
    justify-content: center;
    bottom: 0;
  }

  .category {
    cursor: pointer;
    margin: 0 2px;
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
    width: 100%;
    display: flex;
    flex-direction: row;
    font-weight: 600;
    user-select: none;
  }

  .projection-type-umap {
    width: 55%;
    text-align: center;
  }

  .projection-type-tsne {
    width: 45%;
    text-align: center;
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
  <div class="scatter-gl-container umap-container" bind:this={umapContainer} />
  <div class="scatter-gl-container tsne-container" bind:this={tsneContainer} />
  <div class="projection-types">
    <div class="projection-type-umap">UMAP</div>
    <div class="projection-type-umap">t-SNE</div>
  </div>
  <div class="categories">
    {#if isLoaded}
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
