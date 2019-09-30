<script>
  import { afterUpdate, onMount } from "svelte";
  import { allDemos as demos } from "../../../shared/js/toy-configs";
  import { visualize, getPoints } from "../../toy_visualization/js/visualize";
  import Preview from "./Preview.svelte";
  import { UMAP } from "umap-js";
  import preprocessedDemos from "../js/preprocessed.json";

  let selectedDemoIndex = 0;
  let points = [];
  let selectedDemo = demos[selectedDemoIndex];
  let demoPoints = getPoints(selectedDemo);
  let entries;

  const nNeighborsOptions = [5, 10, 15, 20, 30];
  const minDistOptions = [0, 0.01, 0.05, 0.1, 0.5, 1.0];

  const projections = [];

  let canvas;

  const width = 1024;
  const height = 1024;

  const makeBlankEntries = () =>
    nNeighborsOptions.map(() =>
      minDistOptions.map(() => [{ coords: [0, 0], color: "red" }])
    );

  const setSelectedDemo = i => {
    selectedDemoIndex = i;
    selectedDemo = demos[selectedDemoIndex];
    demoPoints = getPoints(selectedDemo);

    const nextEntries = makeBlankEntries();
    const preprocessed = preprocessedDemos[selectedDemoIndex];
    for (let key in preprocessed) {
      const nNeighbors = key.replace("nNeighbors=", "").split(",")[0] * 1;
      const minDist = key.replace("minDist=", "").split(",")[1] * 1;
      const row = nNeighborsOptions.indexOf(nNeighbors);
      const col = minDistOptions.indexOf(minDist);
      const entry = preprocessed[key];
      nextEntries[row][col] = entry.map(([x, y], i) => {
        return { coords: [x, y], color: demoPoints[i].color };
      });
    }
    entries = nextEntries;
  };

  const groupDemos = groupSize => {
    const groups = [];
    const nGroups = Math.ceil(demos.length / groupSize);
    const split = Math.floor(demos.length / nGroups);
    for (let i = 0; i < nGroups; i++) {
      groups.push(demos.slice(split * i, split * (i + 1)));
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
    display: flex;
    flex-direction: row;
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
    width: 60%;
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
    font-weight: 800;
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
    font-weight: 800;
  }

  #menu {
    display: flex;
    flex-direction: column;
    width: 40%;
  }

  #demo-description {
    width: 400px;
    padding: 4px;
  }

  #demo-select {
    display: flex;
    flex-direction: column;
    margin-top: 44px;
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
        <div id="left-column-header">
          <div id="n-neighbors-header">n_neighbors</div>
        </div>
        <div id="left-column-labels">
          {#each nNeighborsOptions as nNeighbors}
            <div>{nNeighbors}</div>
          {/each}
        </div>
      </div>
    </div>
    <div id="right-column">
      <div id="rows-container">
        <div id="min-dist-header">min_dist</div>
        <div id="min-dist-labels">
          {#each minDistOptions as minDist}
            <div>{minDist}</div>
          {/each}
        </div>
        <div id="rows">
          {#each entries as row, rowIndex}
            <div id="row">
              {#each row as points}
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
      {#each groupDemos(6) as group, groupIndex}
        <div class="demos">
          {#each group as demo, i}
            <Preview
              points={getPoints(demo)}
              onClick={handlePreviewClick(groupIndex * 6 + i)}
              selected={groupIndex * 6 + i === selectedDemoIndex} />
          {/each}
        </div>
      {/each}
    </div>
    <div id="demo-description">{selectedDemo.description}</div>
  </div>
</div>
