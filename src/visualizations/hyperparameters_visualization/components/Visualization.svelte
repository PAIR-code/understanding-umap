<script>
  /* Copyright 2019 Google Inc. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
  ==============================================================================*/

  import { afterUpdate, onMount } from "svelte";
  import { loadData } from "../js/load-data";
  import demos from "../../toy_comparison_visualization/js/demos";
  import {
    visualize,
    getPoints,
    getDemoPreviewOverride
  } from "../../../shared/js/visualize";
  import Preview from "./Preview.svelte";
  import { UMAP } from "umap-js";

  let isLoaded = false;
  let preprocessedDemos;
  let selectedDemoIndex = 0;
  let points = [];
  let selectedDemo = demos[selectedDemoIndex];
  let demoPoints = getPoints(selectedDemo);
  let entries;

  const nNeighborsOptions = [5, 15, 30, 50, 100];
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
        return {
          coords: [x, y],
          color: demoPoints[i].color
        };
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

  onMount(async () => {
    preprocessedDemos = await loadData();
    setSelectedDemo(0);
    isLoaded = true;
  });
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

  .figures-container {
    display: flex;
    font-size: 12px;
    width: 60%;
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

  .left-column-header {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    height: 100%;
    width: 30px;
  }

  .n-neighbors-header {
    writing-mode: vertical-lr;
    text-orientation: sideways;
    transform: rotate(180deg);
    font-weight: 800;
  }

  .left-column-labels {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: flex-end;
    height: 100%;
  }

  .rows-container {
    /* padding: 40px 0 0 40px; */
    position: relative;
  }

  .row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .min-dist-labels {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-around;
  }

  .min-dist-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    height: 30px;
    font-weight: 800;
  }

  .menu {
    display: flex;
    flex-direction: column;
    width: 40%;
  }

  .demo-description {
    width: 400px;
    padding: 4px;
  }

  .demo-text {
    margin-top: 8px;
    margin-bottom: 16px;
  }

  .demo-select {
    display: flex;
    flex-direction: column;
    margin-top: 44px;
  }

  .demo-parameter-name {
    font-weight: 600;
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
</style>

<div class="container">
  {#if isLoaded}
    <div class="figures-container">
      <div class="left-column">
        <div class="left-column-spacer" />
        <div class="left-column-content">
          <div class="left-column-header">
            <div class="n-neighbors-header">n_neighbors</div>
          </div>
          <div class="left-column-labels">
            {#each nNeighborsOptions as nNeighbors}
              <div>{nNeighbors}</div>
            {/each}
          </div>
        </div>
      </div>
      <div class="right-column">
        <div class="rows-container">
          <div class="min-dist-header">min_dist</div>
          <div class="min-dist-labels">
            {#each minDistOptions as minDist}
              <div>{minDist}</div>
            {/each}
          </div>
          <div class="rows">
            {#each entries as row, rowIndex}
              <div class="row">
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
    <div class="menu">
      <div class="demo-select">
        {#each groupDemos(6) as group, groupIndex}
          <div class="demos">
            {#each group as demo, i}
              <Preview
                points={demo.previewOverride ? getDemoPreviewOverride(demo) : getPoints(demo)}
                onClick={handlePreviewClick(groupIndex * 6 + i)}
                selected={groupIndex * 6 + i === selectedDemoIndex} />
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
  {:else}
    <div>Loading...</div>
  {/if}
</div>
