<script lang="ts">
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	let items: { name: string; price: number }[] = [];
	let cart: { name: string; price: number }[] = [];
	let newItemName: string = '';
	let newItemPrice: number = 0;

	function addItem() {
		if (newItemName && newItemPrice > 0) {
			cart.push({ name: newItemName, price: newItemPrice });
			newItemName = '';
			newItemPrice = 0;
		}
	}
</script>

<main>
	<h1>Point of Sale</h1>
	<div>
		<h2>Add Item</h2>
		<input type="text" bind:value={newItemName} placeholder="Item Name" />
		<input type="number" bind:value={newItemPrice} placeholder="Item Price" />
		<button on:click={addItem}>Add to Cart</button>
	</div>

	<h2>Cart</h2>
	<ul>
		{#each cart as item}
			<li>{item.name} - ${item.price.toFixed(2)}</li>
		{/each}
	</ul>
</main>
