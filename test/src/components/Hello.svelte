<script>
  import List from "./List.svelte";

  let word = "World";

  function change() {
    word = "Everybody";
  }

  function changeAgain() {
    word = "Nobody";
  }
</script>

<style lang="less">
  @width: 10px;
  @height: @width + 10px;

  #header {
    width: @width;
    height: @height;
  }
</style>

<button on:click={change}>Change</button>
<button on:click={changeAgain}>Change Again</button>

<h1 id="header">Hello {word}</h1>

<List />
