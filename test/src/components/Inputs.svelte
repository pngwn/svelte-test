<script>
  let text = '',
    textarea = '',
    number = 0,
    checkbox = true,
    color = '#000000',
    range = 0,
    tortilla = 'Plain',
    fillings = [],
    selected,
    fillings2 = [];
</script>

<style>
  fieldset {
    border: 1px solid cadetblue;
    border-top: none;
    padding: 20px 20px 0px 20px;
  }

  label {
    display: inline;
    margin-right: 5px;
  }

  input {
    margin-right: 20px;
  }

  p {
    margin-top: 5px;
    margin-left: 1px;
  }

  fieldset:first-child {
    border-top: 1px solid cadetblue;
  }
</style>

<fieldset>
  <h2>Textarea</h2>
  <label style="display:block" for="textarea">Fill in the textarea:</label>
  <textarea id="textarea" bind:value={textarea} />
  <p>Value TA: {textarea}</p>
</fieldset>

<fieldset>
  <h2>Text Input</h2>
  <label for="text">Email</label>
  <input id="text" bind:value={text} />
  <p>Value EM: {text}</p>
</fieldset>

<fieldset>
  <h2>Number Input</h2>
  <label for="number">Age</label>
  <input id="number" type="number" bind:value={number} />
  <p>Value NU: {number}</p>
</fieldset>

<fieldset>
  <h2>Color Input</h2>
  <label for="color">Eye color</label>
  <input id="color" type="color" bind:value={color} />
  <p>Value CO: {color}</p>
</fieldset>

<fieldset>
  <h2>Range Input</h2>
  <label for="range">Slidey</label>
  <input id="range" type="range" bind:value={range} />
  <p>Value RA: {range}</p>
</fieldset>

<fieldset>
  <h2>Checkbox Input</h2>
  <label for="checkbox">Is it true what they said?</label>
  <input id="checkbox" type="checkbox" bind:checked={checkbox} />
  <p>Value CB: {checkbox}</p>
</fieldset>

<fieldset>
  <h2>Checkbox Input Group</h2>
  <label for="rice">Rice</label>
  <input id="rice" type="checkbox" bind:group={fillings} value="Rice" />
  <label for="beans">Beans</label>
  <input id="beans" type="checkbox" bind:group={fillings} value="Beans" />
  <label for="cheese">Cheese</label>
  <input id="cheese" type="checkbox" bind:group={fillings} value="Cheese" />
  <label for="guac">Guac (extra)</label>
  <input id="guac" type="checkbox" bind:group={fillings} value="Guac (extra)" />
  <p>Value CBG: {fillings}</p>
</fieldset>

<fieldset>
  <h2>Radio Input</h2>
  <label for="plain">Plain</label>
  <input id="plain" type="radio" bind:group={tortilla} value="Plain" />
  <label for="whole">Wholewheat</label>
  <input id="whole" type="radio" bind:group={tortilla} value="Whole wheat" />
  <label for="spinach">Spinach...</label>
  <input id="spinach" type="radio" bind:group={tortilla} value="Spinach" />
  <p>Value RAD: {tortilla}</p>
</fieldset>

<fieldset>
  <h2>Select and Option</h2>
  <label for="select">abc</label>
  <select id="select" bind:value={selected}>
    <option value="a">a</option>
    <option value="b">b</option>
    <option value="c">c</option>
  </select>
  <p>Value SE: {selected}</p>
</fieldset>

<fieldset>
  <h2>Multi Select and Option</h2>
  <label for="fillings2">fillings2</label>
  <select id="fillings2" multiple bind:value={fillings2}>
    <option value="Rice">Rice</option>
    <option value="Beans">Beans</option>
    <option value="Cheese">Cheese</option>
    <option value="Guac (extra)">Guac (extra)</option>
  </select>
  <p>Value MS: {fillings2}</p>
</fieldset>
