<script>
  import { afterUpdate, onMount } from "svelte";
  import { allDemos as demos } from "../../../shared/js/toy-configs";
  import { visualize, getPoints } from "../js/visualize";
  import { runDemo } from "../js/run-demo";

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
  let maxSteps = 200;

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
    if (runningDemo) {
      beginRunDemo();
    }
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
      if (step >= maxSteps) {
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
  #playground {
    overflow: hidden;
    font-family: "Open Sans", sans-serif;
    z-index: 1000;
  }

  #playground * {
    box-sizing: border-box;
  }

  /* Playground Canvas */
  #playground-canvas {
    float: left;
    width: 55%;
  }

  #playground-canvas canvas {
    width: 100%;
  }

  /* Data Menu */
  #data-menu {
    /*float: left;*/
    /*width: 25%*/
    width: 40%;
    float: left;
    margin-bottom: 24px;
    overflow: hidden;
    margin-left: 5%;
  }

  /* Data Details */
  #data-details {
    position: relative;
  }

  @media (min-width: 768px) {
    #data-details {
      width: 40%;
      float: right;
    }
  }

  #data-details #data-controls {
    width: 40%;
    float: right;
    position: relative;
    overflow: hidden;
    font-size: 13px;
  }

  @media (min-width: 768px) {
    #data-details #data-controls {
      width: 50%;
      margin-right: 10%;
      float: left;
    }
  }

  #data-details #play-controls {
    margin-bottom: 8px;
    overflow: hidden;
    position: relative;
  }
  #data-details #play-controls button {
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
  #data-details #play-controls button:disabled {
    background: lightgray;
    cursor: default;
  }
  #play-controls i {
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
    #play-controls i {
      font-size: 30px;
    }
  }
  #play-controls #play-pause i {
    position: absolute;
  }

  #steps-display {
    float: left;
    text-align: center;
    width: 25%;
    line-height: 1.5em;
    font-size: 13px;
  }

  @media (min-width: 1024px) {
    #steps-display {
      font-size: 16px;
      line-height: 1.6em;
    }
  }
  #data-details #data-description {
    width: 50%;
    margin-right: 10%;
    float: right;
    font-size: 14px;
    line-height: 1.6em;
  }

  @media (min-width: 768px) {
    #data-details #data-description {
      width: 40%;
      float: left;
      margin-right: 0;
    }
  }

  #data-details #share {
    margin-top: 8px;
    display: block;
    color: rgba(0, 0, 0, 0.4);
    text-decoration: none;
    font-size: 12px;
  }

  #data-details #share:hover {
    text-decoration: underline;
  }

  #data-details #share i {
    line-height: 0px;
    position: relative;
    top: 7px;
  }

  .parameters-label {
    font-style: bold;
    font-weight: 800;
    margin-bottom: 8px;
  }
</style>

<div id="playground">

  <div id="playground-canvas">
    <canvas bind:this={canvas} id="output" width="600" height="600" />
  </div>

  <div id="data-menu">
    {#each demos as demo, i}
      <Preview
        {demo}
        onClick={handlePreviewClick(i)}
        selected={i === selectedDemoIndex} />
    {/each}
  </div>

  <div id="data-details">
    <div id="data-controls">
      <div id="play-controls">
        <button id="play-pause" on:click={playPause} disabled={isFinished}>
          {#if isRunning}
            <i class="material-icons">pause</i>
          {:else}
            <i class="material-icons">play_arrow</i>
          {/if}
        </button>
        <button
          id="restart"
          on:click={restart}
          disabled={isRunning || step === 0}>
          <i class="material-icons">refresh</i>
        </button>
        <div id="steps-display">
          Step
          <br />
          <span id="step">{step}</span>
        </div>
      </div>
      <div id="data-options">
        <div class="parameters-label">Dataset Parameters</div>
        {#each demo.options as demoOption (demoOption.name)}
          <Parameter options={demoOption} bind:value={demoOption.start} />
        {/each}
      </div>
      <div id="umap-options">
        <div class="parameters-label">UMAP Parameters</div>
        <Parameter
          options={{ name: 'nNeighbors', min: nNeighborsMin, max: nNeighborsMax, step: 1 }}
          bind:value={nNeighbors} />
        <Parameter
          options={{ name: 'minDist', min: minDistMin, max: minDistMax, step: 0.01 }}
          bind:value={minDist} />
      </div>
    </div>
    <div id="data-description">
      <span>{demo.description}</span>
      <a id="share" style="display:none;" href=".">
        <i class="material-icons">link</i>
        Share this view
      </a>
    </div>
  </div>
</div>
