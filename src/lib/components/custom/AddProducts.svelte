<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { componentSide } from '../../component.store';
	import Button from '../ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import { parseUnit, type Product, type Unit } from '../../../database/model';
	import { db } from '../../../database/db';
	import { toast } from 'svelte-sonner';

	export let data;
	let newData: Product = {
		code: '',
		createdOn: new Date(),
		updatedOn: new Date(),
		name: '',
		unit: 'gram'
	};

	$: if (!!data) {
		console.log(data);
		newData = data;
	}
</script>

<!-- <Card.Root> -->
<Card.Header>
	<Card.Title>Product Update/Insert</Card.Title>
</Card.Header>
<Card.Content>
	<div class="grid gap-6">
		<div class="grid gap-3">
			<Label for="name">Product Name</Label>
			<Input id="name" type="text" bind:value={newData.name} class="w-full" />
		</div>
		<div class="grid gap-3">
			<Label for="name">Code</Label>
			<Input id="name" type="text" bind:value={newData.code} class="w-full" />
		</div>
		<div class="grid gap-3">
			<Label for="unit">Unit</Label>
			<Select.Root
				selected={{ value: 'gram', label: 'gram' }}
				onSelectedChange={(v) => {
					if (v && typeof v.value === 'string') {
						newData.unit = parseUnit(v.value);
					}
				}}
			>
				<Select.Trigger>
					<Select.Value placeholder="Select an Unit" />
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Label>Type</Select.Label>
						{#each ['gram', 'meter', 'kilograms', 'pieces', 'liter'] as type}
							<Select.Item value={type} label={type}>{type}</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		</div>
	</div>
</Card.Content>
<Card.Footer class="flex justify-end gap-2 ">
	<Button
		on:click={() => {
			componentSide.set(null);
		}}
		variant="outline">Cancel</Button
	>
	<Button
		disabled={newData.name == '' || newData.code == ''}
		on:click={() => {
			if (newData.id == '') delete newData.id;
			console.log(newData);
			if (newData.id == undefined) db.product.add(newData);
			else db.product.update(newData.id, { ...newData });
			toast.success('Product  added successfully');
			componentSide.set(null);
		}}
		variant="default">Submit</Button
	>
</Card.Footer>
<!-- </Card.Root> -->
