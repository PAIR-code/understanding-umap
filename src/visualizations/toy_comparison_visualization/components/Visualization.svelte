<script>
  import { afterUpdate, onMount } from "svelte";
  import demos from "../js/demos";
  import { loadData } from "../js/load_data";
  import {
    visualize,
    getPoints,
    getDemoPreviewOverride
  } from "../../../shared/js/visualize";
  import Preview from "./Preview.svelte";
  import { UMAP } from "umap-js";

  const DEFAULT_DEMO_INDEX = 11;

  let isLoaded = false;
  let selectedDemoIndex = DEFAULT_DEMO_INDEX;
  let preprocessedDemos;
  let points = [];
  let selectedDemo = demos[selectedDemoIndex];
  let demoPoints = getPoints(selectedDemo);
  let entries;

  const GROUP_SIZE = 8;

  const nNeighborsOptions = [3, 5, 15, 30, 50, 100];
  const perplexityOptions = [3, 5, 15, 30, 50, 100];

  const projections = [];

  let canvas;

  const width = 1024;
  const height = 1024;

  const makeBlankEntries = () => ({
    tsne: nNeighborsOptions.map(() => []),
    umap: nNeighborsOptions.map(() => [])
  });

  const setSelectedDemo = i => {
    selectedDemoIndex = i;
    selectedDemo = demos[selectedDemoIndex];
    demoPoints = getPoints(selectedDemo);

    const nextEntries = makeBlankEntries();
    const preprocessed = preprocessedDemos[selectedDemoIndex];

    const { tsne, umap } = preprocessed;

    for (let key in umap) {
      const entry = umap[key];
      const nNeighbors = key.replace("nNeighbors=", "").split(",")[0] * 1;
      const index = nNeighborsOptions.indexOf(nNeighbors);
      nextEntries.umap[index] = entry.map(([x, y], i) => {
        return { coords: [x, y], color: demoPoints[i].color };
      });
    }
    for (let key in tsne) {
      const entry = tsne[key];
      const perplexity = key.replace("perplexity=", "").split(",")[0] * 1;
      const index = perplexityOptions.indexOf(perplexity);
      nextEntries.tsne[index] = entry.map(([x, y], i) => {
        return { coords: [x, y], color: demoPoints[i].color };
      });
    }
    entries = nextEntries;
  };

  const groupDemos = groupSize => {
    const groups = [];
    const nGroups = Math.ceil(demos.length / groupSize);
    for (let i = 0; i < nGroups; i++) {
      groups.push(demos.slice(groupSize * i, groupSize * (i + 1)));
    }
    return groups;
  };

  const handlePreviewClick = i => () => {
    setSelectedDemo(i);
  };

  onMount(async () => {
    preprocessedDemos = await loadData();
    setSelectedDemo(DEFAULT_DEMO_INDEX);
    isLoaded = true;
  });
</script>

<style>
  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .demos {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .figures-container {
    display: flex;
    font-size: 12px;
    width: 80%;
  }

  .left-column {
    width: 40px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .left-column-spacer {
    height: 40px;
  }

  .left-column-content {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    height: 100%;
  }

  .left-column-labels {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: flex-end;
    height: 100%;
    font-weight: 800;
  }

  .hyperparam-labels {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-around;
  }

  .hyperparam-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    height: 30px;
    font-weight: 800;
  }

  .menu {
    display: flex;
    width: 80%;
    padding-left: 35px;
    box-sizing: border-box;
  }

  .demo-select {
    display: flex;
    flex-direction: column;
  }
  .rows-container {
    /* padding: 40px 0 0 40px; */
    position: relative;
  }

  .rows {
    display: flex;
    flex-direction: column;
  }

  .row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .demo-description {
    width: 700px;
    padding: 4px;
    display: flex;
    flex-direction: column;
  }

  .demo-text {
    margin-bottom: 10px;
  }

  .demo-parameter-name {
    font-weight: 600;
  }
</style>

{#if isLoaded}
  <div class="container">
    <div class="figures-container">
      <div class="left-column">
        <div class="left-column-spacer" />
        <div class="left-column-content">
          <div class="left-column-labels">
            <div>t-SNE</div>
            <div>UMAP</div>
          </div>
        </div>
      </div>
      <div class="right-column">
        <div class="rows-container">
          <div class="hyperparam-header">perplexity / n_neighbors</div>
          <div class="hyperparam-labels">
            {#each nNeighborsOptions as nNeighbors}
              <div>{nNeighbors}</div>
            {/each}
          </div>
          <div class="rows">
            {#each Object.keys(entries) as key}
              <div class="row">
                {#each entries[key] as points}
                  <Preview
                    {points}
                    onClick={() => {}}
                    highlighted={true}
                    selectable={false}
                    selected={false} />
                {/each}
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
    <div class="menu">
      <div class="demo-select">
        {#each groupDemos(GROUP_SIZE) as group, groupIndex}
          <div class="demos">
            {#each group as demo, i}
              <Preview
                points={demo.previewOverride ? getDemoPreviewOverride(demo) : getPoints(demo)}
                onClick={handlePreviewClick(groupIndex * GROUP_SIZE + i)}
                selected={groupIndex * GROUP_SIZE + i === selectedDemoIndex} />
            {/each}
          </div>
        {/each}
      </div>
      <div class="demo-description">
        <div class="demo-text">{selectedDemo.description}</div>
        {#each selectedDemo.options as option}
          <div class="demo-parameters">
            <span class="demo-parameter-name">{option.name}:</span>
            <span>{option.start}</span>
          </div>
        {/each}
      </div>
    </div>
  </div>
{:else}
  <div>Loading...</div>
{/if}
