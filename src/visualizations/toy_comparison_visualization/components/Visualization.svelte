<script>
  import { afterUpdate, onMount } from "svelte";
  import demos from "../js/demos";
  import { visualize, getPoints } from "../../toy_visualization/js/visualize";
  import Preview from "./Preview.svelte";
  import { UMAP } from "umap-js";
  import preprocessedDemos from "../js/preprocessed.json";

  let selectedDemoIndex = 0;
  let points = [];
  let selectedDemo = demos[selectedDemoIndex];
  let demoPoints = getPoints(selectedDemo);
  let entries;

  const GROUP_SIZE = 8;

  const nNeighborsOptions = [2, 5, 15, 30, 50, 100];
  const perplexityOptions = [2, 5, 15, 30, 50, 100];

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

  setSelectedDemo(0);

  afterUpdate(() => {});
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

  #figures-container {
    display: flex;
    font-size: 12px;
    width: 80%;
  }

  #left-column {
    width: 40px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  #left-column-spacer {
    height: 40px;
  }

  #left-column-content {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    height: 100%;
  }

  #left-column-header {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    height: 100%;
    width: 30px;
  }

  #n-neighbors-header {
    writing-mode: vertical-lr;
    text-orientation: sideways;
    transform: rotate(180deg);
  }

  #left-column-labels {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: flex-end;
    height: 100%;
  }

  #rows-container {
    /* padding: 40px 0 0 40px; */
    position: relative;
  }

  #row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  #min-dist-labels {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-around;
  }

  #min-dist-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    height: 30px;
  }

  #menu {
    display: flex;
    width: 80%;
    padding-left: 35px;
    box-sizing: border-box;
  }

  #demo-description {
    width: 400px;
    padding: 4px;
  }

  #demo-select {
    display: flex;
    flex-direction: column;
  }

  #rows {
    display: flex;
    flex-direction: column;
  }

  #row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
</style>

<div class="container">
  <div id="figures-container">
    <div id="left-column">
      <div id="left-column-spacer" />
      <div id="left-column-content">
        <div id="left-column-labels">
          <div>t-SNE</div>
          <div>UMAP</div>
        </div>
      </div>
    </div>
    <div id="right-column">
      <div id="rows-container">
        <div id="min-dist-header">perplexity / nNeighbors</div>
        <div id="min-dist-labels">
          {#each nNeighborsOptions as nNeighbors}
            <div>{nNeighbors}</div>
          {/each}
        </div>
        <div id="rows">
          {#each Object.keys(entries) as key}
            <div id="row">
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
  <div id="menu">
    <div id="demo-select">
      {#each groupDemos(GROUP_SIZE) as group, groupIndex}
        <div class="demos">
          {#each group as demo, i}
            <Preview
              points={getPoints(demo)}
              onClick={handlePreviewClick(groupIndex * GROUP_SIZE + i)}
              selected={groupIndex * GROUP_SIZE + i === selectedDemoIndex} />
          {/each}
        </div>
      {/each}
    </div>
    <div id="demo-description">{selectedDemo.description}</div>
  </div>
</div>
