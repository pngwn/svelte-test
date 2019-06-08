<script>
  import { quintOut } from 'svelte/easing';
  import { crossfade, scale, fly } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { tick, createEventDispatcher } from 'svelte';
  import { fetchStore } from './get.js';

  const dispatch = createEventDispatcher();

  const crops = fetchStore();
  let name = '',
    latin = '',
    verdict = true,
    options = false,
    board,
    error = false;

  const [send, receive] = crossfade({
    fallback: scale,
    duration: 400,
  });

  const getIndex = id => $crops.data.findIndex(v => v.id === id);

  const add = e => {
    if (!name) {
      error = true;
      return;
    }

    crops.add({ name, latin, verdict });
    name = latin = '';
    verdict = true;
  };

  function toFly(node, params) {
    const opts = { y: node.offsetHeight * -1, opacity: 1 };
    return fly(node, opts);
  }

  function validate() {
    if (!name) {
      error = true;
    } else {
      error = false;
    }
  }
</script>

<style>
  :global(html) {
    font-family: Lato, sans-serif;
  }
  .new-todo {
    font-size: 1.4em;
    width: 100%;
    margin: 2em 0 1em 0;
  }

  .board {
    width: 100%;
    padding-bottom: 100px;
    float: left;
  }

  .left,
  .right {
    float: left;
    width: 50%;
    padding: 0 3em;
    box-sizing: border-box;
  }

  h1 {
    text-align: center;
    margin-top: -70px;
    transform: translateY(90px);
  }

  .right h2 {
    margin-left: 0.25em;
  }

  .left h2 {
    text-align: right;
    margin-right: 0.25em;
  }

  .latin {
    /* font-style: italic; */
    color: #555;
    display: block;
    margin-top: 5px;
  }

  h2 {
    font-size: 2em;
    font-weight: 200;
    user-select: none;
    text-transform: uppercase;
  }

  .left label,
  .right label {
    top: 0;
    left: 0;
    display: block;
    font-size: 1em;
    line-height: 1;
    padding: 0.5em;
    margin: 0.5em;
    border-radius: 2px;
    background-color: #eee;
    user-select: none;
    border: 5px solid transparent;
    transition: border 0.2s;
  }

  .left input,
  .right input {
    margin: 0;
  }
  .left .grid-wrap {
    justify-content: flex-end;
  }
  .left label {
    background-color: rgb(180, 240, 100);
  }

  .right label {
    background-color: rgb(240, 100, 100);
  }

  .grid-wrap {
    display: flex;
    flex-wrap: wrap;
  }

  .right label:hover {
    border-color: rgb(180, 240, 100);
  }

  .left label:hover {
    border-color: rgb(240, 100, 100);
  }

  form input {
    margin: 0;
    margin-right: 30px;
    width: 300px;
    border: none;
    border-radius: 2px;
    background: #333;
    color: #eee;
    padding: 5px 10px;
    border: 5px solid transparent;
  }

  input:focus {
    background: #eee;
    color: #333;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }

  .emoji {
    font-size: 30px;
    display: inline;
    cursor: pointer;
  }

  form {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    background: orange;
    width: 100%;
    padding-top: 30px;
    margin: 0;
  }

  .inputs {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    flex-wrap: wrap;
  }

  .buttons {
    display: flex;
  }
  form button {
    margin-top: 30px;
    display: block;
    width: 100%;
    border: none;
    background: #0073ff;
    color: #fff;
    cursor: pointer;
    padding: 10px 0px;
    font-size: 1.2em;
    transition: background 0.2s;
  }

  form button:hover {
    background: #338fff;
  }

  .controls {
    clear: both;
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    justify-content: stretch;
  }

  .controls button {
    padding: 20px 0px;
    background: darkorange;
    border: none;
    font-size: 1.2em;
    width: 100%;
    cursor: pointer;
    transition: background 0.2s;
  }

  .controls button:hover {
    background: orange;
  }

  .error {
    position: absolute;
    transform: translate(-110%, 40px);
  }

  @media (max-width: 900px) {
    form .inputs {
      flex-direction: column;
    }

    form input {
      margin: 10px;
      width: 80%;
      text-align: center;
      box-sizing: border-box;
    }

    .emoji {
      margin-top: 10px;
      padding-top: 40px;
    }

    .error {
      position: absolute;
      transform: translate(0%, 30px);
    }
  }
</style>

{#if options}
  <form on:submit|preventDefault={add} transition:toFly>
    <div class="inputs">

      <label class="sr-only" for="name">Common Name</label>
      <input
        id="name"
        class="new-todo"
        placeholder="Common name"
        bind:value={name}
        on:input={validate}
        style="border-color: {error ? 'tomato ' : 'transparent'}" />
      {#if error}
        <span class="error">Please enter a name for your crop</span>
      {/if}
      <label class="sr-only" for="latin">Latin Name</label>
      <input
        id="latin"
        class="new-todo"
        placeholder="Latin name"
        bind:value={latin} />
      <label for="verdict" class="emoji">
        <span class="sr-only">Verdict: Good or Bad</span>
        <span style="opacity: {verdict ? 0.5 : 1}">😇</span>
        <span style="opacity: {verdict ? 1 : 0.5}">😈</span>

      </label>
      <input
        class="sr-only"
        id="verdict"
        bind:checked={verdict}
        type="checkbox" />
    </div>

    <div class="buttons">
      <button type="submit">Submit</button>
      <button type="button" on:click={() => (options = false)}>Close</button>
    </div>
  </form>
{/if}

<div class="board" bind:this={board}>

  <h1>
    <span style="transform: rotateY(180deg); display: inline-block;">🌾</span>
    <span>🌾</span>
  </h1>

  <div class="left">
    <h2>good crop</h2>
    <div class="grid-wrap" data-testid="good">
      {#each $crops.data.filter(({ verdict }) => !verdict) as { name, latin, id, verdict } (id)}
        <label
          in:receive={{ key: id }}
          out:send={{ key: id }}
          animate:flip={{ duration: 400 }}>
          <input
            class="sr-only"
            type="checkbox"
            checked={verdict}
            on:change={() => crops.change(id)} />
           {name}
          <span class="latin">{latin}</span>
        </label>
      {/each}
    </div>
  </div>

  <div class="right">
    <h2>bad crop</h2>
    <div class="grid-wrap" data-testid="bad">
      {#each $crops.data.filter(({ verdict }) => verdict) as { name, latin, id, verdict } (id)}
        <label
          in:receive={{ key: id }}
          out:send={{ key: id }}
          animate:flip={{ duration: 400 }}>
          <input
            class="sr-only"
            type="checkbox"
            checked={verdict}
            on:change={() => crops.change(id)} />
           {name}
          <span class="latin">{latin}</span>
        </label>
      {/each}
    </div>
  </div>

</div>

<div class="controls">
  {#if $crops.next}
    <button on:click={crops.getSomeCrops}>Load more crops</button>
  {/if}
  <button on:click={crops.reset}>Reset crops</button>
  <button on:click={() => (options = !options)}>
     {options ? 'Close menu' : 'Add a crop'}
  </button>
</div>
