<script>
  import Figure from "../../article/Figure.svelte";
  import Visualization from "./components/Visualization.svelte";
  import VisualizationSideBySide from "./components/VisualizationSideBySide.svelte";

  export let sideBySide = true;
</script>

<style>

</style>

<Figure>
  {#if sideBySide}
    <VisualizationSideBySide />
  {:else}
    <Visualization />
  {/if}
</Figure>
