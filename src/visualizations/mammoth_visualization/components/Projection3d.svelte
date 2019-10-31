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

  import { onMount, afterUpdate, createEventDispatcher } from "svelte";
  import { loadData } from "../js/load-data";
  import { COLORS } from "../js/colors";

  const dispatch = createEventDispatcher();

  let container;
  let scatterGL;
  let isOrbiting = true;

  export let colorIndices;
  export let mammoth3d;
  export let title = "";
  export let hoveredPointIndex = -1;

  function handleMouseout() {
    dispatch("hover", -1);
  }

  const toggleOrbit = () => {
    isOrbiting = true;
    scatterGL.startOrbitAnimation();
  };

  onMount(async () => {
    const dataset = {
      dimensions: 3,
      points: mammoth3d,
      metadata: []
    };

    const onCameraMove = () => {
      if (isOrbiting) isOrbiting = false;
    };

    const styles = {
      fog: { enabled: false },
      point: { scaleHover: 3.5, colorHover: "rgba(0,0,0,1)" }
    };

    scatterGL = new ScatterGL(container, {
      styles,
      selectEnabled: false,
      onCameraMove,
      onHover: d => {
        if (d === null || d === hoveredPointIndex) return;
        dispatch("hover", d);
      }
    });
    window.scatterGLObj = scatterGL;

    scatterGL.setPointColorer(i => {
      const colorIndex = colorIndices[i];
      return COLORS[colorIndex];
    });
    scatterGL.render(dataset);
  });

  afterUpdate(() => {
    // debugger
    scatterGL.setHoverPointIndex(hoveredPointIndex);
  });
</script>

<style>
  .container {
    width: 45%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    margin-bottom: 20px;
    position: relative;
  }

  .scatter-gl-container {
    width: 100%;
    min-height: 500px;
  }

  .title {
    text-align: center;
    width: 100%;
    font-weight: bold;
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

<div class="container" on:mouseout={handleMouseout}>
  {#if title}
    <div class="title">{title}</div>
  {/if}
  <div class="scatter-gl-container" bind:this={container} />
  {#if !isOrbiting}
    <div class="orbit" on:click={toggleOrbit}>
      <i class="material-icons">3d_rotation</i>
    </div>
  {/if}
</div>
