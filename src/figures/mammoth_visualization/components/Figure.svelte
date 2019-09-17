<script>
  import MammothUMAP from "./MammothUmap.svelte";
  // import UmapVsTsne from "./UmapVsTsne.svelte";
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
</style>

<div class="container">
  <MammothUMAP />
</div>
