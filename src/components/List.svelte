<script>
	let list = [1, 2, 3];
	
	const remove = (index) => {
		list = list.filter((v, i) => index !== i);
	}
	
	const add = () => {
		console.log(list.length, list)
		list = list.length ?  list.concat(list[list.length-1]+1): [1];
	}
</script>

<button on:click="{add}">Add</button>

{#each list as l, i}
	<div>
		List Item: {l} 
		<button on:click="{() => remove(i)}">Remove</button>
	</div>
{:else}
	<p>There is nothing here.</p>
{/each}