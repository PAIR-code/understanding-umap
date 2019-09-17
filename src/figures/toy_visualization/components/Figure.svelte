<script>
  import { afterUpdate, onMount } from "svelte";
  import { demos } from "../js/demo-configs";
  import { visualize, getPoints } from "../js/visualize";
  import { runDemo } from "../js/run-demo";

  import Preview from "./Preview.svelte";
  import Parameter from "./Parameter.svelte";

  let isRunning = false;
  let lastSelectedDemoIndex = null;
  let selectedDemoIndex = 0;
  let demo = demos[selectedDemoIndex];
  let step = 0;
  let canvas;
  let maxSteps = 200;

  let runningDemo;

  const umapOptions = [
    {
      name: "nNeighbors",
      min: 3,
      max: 100,
      value: 15
    },
    {
      name: "minDist",
      min: 0,
      max: 1,
      value: 0.1,
      step: 0.01
    }
  ];

  let handlePreviewClick = index => () => {
    selectedDemoIndex = index;
    demo = demos[selectedDemoIndex];
  };

  const playPause = () => console.log("playpause!");
  const restart = () => {
    if (runningDemo) {
      beginRunDemo();
    }
  };

  const getUMAPOptions = () => {
    const [nNeighbors, minDist] = umapOptions;
    return {
      nNeighbors: nNeighbors.value,
      minDist: minDist.value
    };
  };

  const beginRunDemo = () => {
    const points = getPoints(demo);
    runningDemo = runDemo(points, canvas, getUMAPOptions(), currentStep => {
      step = currentStep;
      if (step >= maxSteps) {
        isRunning = false;
        runningDemo.pause();
      }
    });
  };

  onMount(() => {
    const points = getPoints(demo);
    visualize(points, canvas, null, null);
  });

  afterUpdate(() => {
    if (lastSelectedDemoIndex !== selectedDemoIndex) {
      beginRunDemo();
      isRunning = true;
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

  #playground.modal {
    position: fixed;
    left: 10px;
    right: 10px;
    top: 50px;
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
    margin-bottom: 18px;
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
        <button id="play-pause" on:click={playPause}>
          {#if isRunning}
            <i class="material-icons">pause</i>
          {:else}
            <i class="material-icons">play_arrow</i>
          {/if}
        </button>
        <button id="restart" on:click={restart}>
          <i class="material-icons">refresh</i>
        </button>
        <div id="steps-display">
          Step
          <br />
          <span id="step">{step}</span>
        </div>
      </div>
      <div id="data-options">
        {#each demo.options as demoOption (demoOption.name)}
          <Parameter options={demoOption} bind:value={demoOption.start} />
        {/each}
      </div>
      <div id="umap-options">
        {#each umapOptions as umapOption (umapOption.name)}
          <Parameter options={umapOption} bind:value={umapOption.value} />
        {/each}
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
