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
  import { allDemos as demos } from "../../../shared/js/toy-configs";
  import { visualize, getPoints } from "../../../shared/js/visualize";
  import { runDemo, N_EPOCHS } from "../../../shared/js/run-demo";

  import Preview from "./Preview.svelte";
  import Parameter from "./Parameter.svelte";

  let isRunning = false;
  let isFinished = false;
  let lastSelectedDemoIndex = 0;
  let selectedDemoIndex = 0;
  let points = [];
  let demo = demos[selectedDemoIndex];
  let step = 0;
  let canvas;

  let nNeighbors = 15;
  let nNeighborsMin = 3;
  let nNeighborsMax = 100;

  let minDist = 0.1;
  let minDistMin = 0;
  let minDistMax = 1;

  let runningDemo;

  let handlePreviewClick = index => () => {
    selectedDemoIndex = index;
    demo = demos[selectedDemoIndex];
  };

  const playPause = () => {
    if (isRunning && runningDemo) {
      runningDemo.pause();
      isRunning = !isRunning;
    } else if (!isRunning && runningDemo) {
      runningDemo.unpause();
      isRunning = !isRunning;
    } else if (!isRunning && !runningDemo) {
      beginRunDemo();
    }
  };

  const restart = () => {
    beginRunDemo();
  };

  const beginRunDemo = () => {
    if (runningDemo) runningDemo.pause();
    isRunning = true;
    isFinished = false;

    if (nNeighbors >= points.length) {
      nNeighbors = points.length - 1;
    }
    const umapOptions = { nNeighbors, minDist };

    runningDemo = runDemo(points, canvas, umapOptions, currentStep => {
      step = currentStep;
      if (step >= N_EPOCHS) {
        isRunning = false;
        isFinished = true;
        runningDemo.pause();
      }
    });
  };

  onMount(() => {
    points = getPoints(demo);
    visualize(points, canvas, null, null);
  });

  afterUpdate(() => {
    demo = demos[selectedDemoIndex];
    points = getPoints(demo);

    if (lastSelectedDemoIndex !== selectedDemoIndex) {
      beginRunDemo();
      lastSelectedDemoIndex = selectedDemoIndex;
    }
  });
</script>

<style>
  .playground {
    overflow: hidden;
    font-family: "Open Sans", sans-serif;
    z-index: 1000;
  }

  .playground * {
    box-sizing: border-box;
  }

  /* Playground Canvas */
  .playground-canvas {
    float: left;
    width: 55%;
  }

  .playground-canvas canvas {
    width: 100%;
  }

  /* Data Menu */
  .data-menu {
    /*float: left;*/
    /*width: 25%*/
    width: 40%;
    float: left;
    margin-bottom: 24px;
    overflow: hidden;
    margin-left: 5%;
  }

  /* Data Details */
  .data-details {
    position: relative;
  }

  @media (min-width: 768px) {
    .data-details {
      width: 40%;
      float: right;
    }
  }

  .data-details .data-controls {
    width: 40%;
    float: right;
    position: relative;
    overflow: hidden;
    font-size: 13px;
  }

  @media (min-width: 768px) {
    .data-details .data-controls {
      width: 50%;
      float: left;
    }
  }

  .data-details .play-controls {
    margin-bottom: 15px;
    overflow: hidden;
    position: relative;
  }
  .data-details .play-controls button {
    cursor: pointer;
    outline: none;
    border-radius: 50%;
    background: steelblue;
    color: white;
    width: 25%;
    margin-right: 5%;
    padding-top: 25%;
    padding-bottom: 0;
    border: none;
    float: left;
    position: relative;
  }
  .data-details .play-controls button:disabled {
    background: lightgray;
    cursor: default;
  }
  .play-controls i {
    display: block;
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 36px;
    font-size: 24px;
    line-height: 0;
  }
  @media (min-width: 768px) {
    .play-controls i {
      font-size: 30px;
    }
  }
  .play-controls .play-pause i {
    position: absolute;
  }

  .steps-display {
    float: left;
    text-align: center;
    width: 25%;
    line-height: 1.5em;
    font-size: 13px;
  }

  @media (min-width: 1024px) {
    .steps-display {
      font-size: 16px;
      line-height: 1.6em;
    }
  }
  .data-details .data-description {
    width: 50%;
    float: right;
    font-size: 13px;
  }

  .data-description-text {
    min-height: 60px;
    margin-bottom: 5px;
  }

  @media (min-width: 768px) {
    .data-details .data-description {
      width: 50%;
      float: left;
      margin-right: 0;
    }
  }

  .parameters-label {
    font-style: bold;
    font-weight: 800;
    margin-bottom: 8px;
  }
</style>

<div class="playground">

  <div class="playground-canvas">
    <canvas bind:this={canvas} class="output" width="600" height="600" />
  </div>

  <div class="data-menu">
    {#each demos as demo, i}
      <Preview
        {demo}
        onClick={handlePreviewClick(i)}
        selected={i === selectedDemoIndex} />
    {/each}
  </div>

  <div class="data-details">
    <div class="data-controls">
      <div class="play-controls">
        <button class="play-pause" on:click={playPause} disabled={isFinished}>
          {#if isRunning}
            <i class="material-icons">pause</i>
          {:else}
            <i class="material-icons">play_arrow</i>
          {/if}
        </button>
        <button
          class="restart"
          on:click={restart}
          disabled={isRunning || step === 0}>
          <i class="material-icons">refresh</i>
        </button>
        <div class="steps-display">
          Step
          <br />
          <span class="step">{step}</span>
        </div>
      </div>
      <div class="umap-options">
        <div class="parameters-label">UMAP Parameters</div>
        <Parameter
          options={{ name: 'n_neighbors', min: nNeighborsMin, max: nNeighborsMax, step: 1 }}
          bind:value={nNeighbors}
          onChange={restart} />
        <Parameter
          options={{ name: 'min_dist', min: minDistMin, max: minDistMax, step: 0.01 }}
          bind:value={minDist}
          onChange={restart} />
      </div>
    </div>
    <div class="data-description">
      <div class="data-description-text">{demo.description}</div>
      <div class="data-options">
        <div class="parameters-label">Dataset Parameters</div>
        {#each demo.options as demoOption (demoOption.name)}
          <Parameter
            options={demoOption}
            bind:value={demoOption.start}
            onChange={restart} />
        {/each}
      </div>
    </div>

  </div>
</div>
