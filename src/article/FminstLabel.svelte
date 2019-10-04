<script>
  export let label;

  const onClick = e => {
    e.preventDefault();
    e.stopPropagation();

    if (window._selectFmnistLabel) {
      window._selectFmnistLabel(e, label);
    }

    return false;
  };
</script>

<style>

</style>

<a class="label" href="#" on:click={onClick}>{label}</a>
