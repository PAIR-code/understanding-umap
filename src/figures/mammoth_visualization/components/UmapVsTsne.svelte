<script>
  import { onMount } from "svelte";
  import { loadTSNE } from "../js/data";
  import { COLORS } from "../js/colors";

  let canvas;

  const width = 1024;
  const height = 1024;

  onMount(async () => {
    const projection = await loadTSNE();

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    let colorIndex = -1;
    let nColorPoints = 0;
    for (let i = 0; i < projection.length; i++) {
      const point = projection[i];
      const [x, y] = point;
      // if (i >= nColorPoints) {
      // colorIndex += 1;
      // nColorPoints += labelOffsets[colorIndex];
      // ctx.fillStyle = COLORS[colorIndex];
      // }

      ctx.fillRect(x, y, 3, 3);
    }
  });
</script>

<style>
  canvas {
    background-color: #fff;
    width: 100%;
    margin-bottom: 20px;
  }

  .container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 800px;
  }
</style>

<div class="container">
  <canvas bind:this={canvas} width={1024} height={1024} />
</div>
