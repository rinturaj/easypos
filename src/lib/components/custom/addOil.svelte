<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { componentSide } from '../../component.store';
	import Button from '../ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import type { Nosil, Oil } from '../../../database/model';
	import { db } from '../../../database/db';
	import { liveQuery } from 'dexie';

	let newData: Oil = {
		name: '',
		quantity: 0,
		size: '',
		unitPrice: 0,
		createdOn: new Date()
	};
	let add = () => {
		db.oil.add(newData);
		componentSide.set(null);
	};
	$: oilListName = liveQuery(async () => {
		return [...new Set((await db.oil.toArray()).map((x) => x.name))];
	});
</script>

<div class="w-full p-3">
	<!-- <Card.Root> -->
	<Card.Header>
		<Card.Title>Add Oil</Card.Title>
		<Card.Description>Create or update Oil details</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="grid gap-6">
			<div class="grid gap-3">
				<Label for="name">Name</Label>
				<Input
					id="name"
					bind:value={newData.name}
					type="text"
					list="browsers"
					class="w-full"
					autocomplete="off"
					placeholder="name here"
				/>

				<datalist id="browsers">
					{#if !!$oilListName && $oilListName.length > 0}
						{#each $oilListName as name}
							<option value={name}> {name}</option>
						{/each}
					{/if}
				</datalist>
			</div>

			<div class="grid gap-3">
				<Label for="description">Size</Label>
				<Input id="description" bind:value={newData.size} />
			</div>
			<div class="grid gap-3">
				<Label for="description">quantity</Label>
				<Input type="number" id="description" bind:value={newData.quantity} />
			</div>
			<div class="grid gap-3">
				<Label for="description">Unit Price</Label>
				<Input type="number" id="description" bind:value={newData.unitPrice} />
			</div>
		</div>
	</Card.Content>
	<Card.Footer class="justify-end">
		<Button
			on:click={() => {
				componentSide.set(null);
			}}
			variant="outline"
			class="mr-3">Cancel</Button
		>
		<Button
			disabled={newData.name == '' || newData.unitPrice <= 0 || newData.quantity == 0}
			on:click={add}>Add</Button
		>
	</Card.Footer>
	<!-- </Card.Root> -->
</div>
