<script>
  export let word = 'World';

  export function change() {
    word = 'Everybody';
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

<h1 id="header">Hello {word}</h1>
