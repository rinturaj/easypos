<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { componentSide } from '../../component.store';
	import Button from '../ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import {
		parseUnit,
		StockOverviewClass,
		type StockOverview,
		type Product,
		type ProductMargin,
		type Unit
	} from '../../../database/model';
	import { db } from '../../../database/db';
	import { toast } from 'svelte-sonner';
	import { liveQuery } from 'dexie';

	export let data;
	let newData: ProductMargin = {
		margin: 0,
		marginType: 'Percent',
		stock: undefined,
		stockOverview: ''
	};

	$: if (!!data) {
		console.log(data);
		newData = data;
	}

	$: stockOverviewProducts = liveQuery(async () => {
		const margin = (await db.productMargin.toArray()).map((x) => x.stockOverview);
		let stockOverview = await db.stockOverview
			.filter((x) => !margin.includes(x?.id || ''))
			.toArray();
		return stockOverview;
	});

	function mapProduct(p: any) {
		newData.stock = p;
		newData.stockOverview = p.id || '';
	}
</script>

<!-- <Card.Root> -->
<Card.Header>
	<Card.Title>Product Margin Update/Insert</Card.Title>
</Card.Header>
<Card.Content>
	<div class="grid gap-6">
		<div class="grid gap-3">
			<Label for="name">Product Name</Label>
			<Select.Root
				selected={{ value: newData, label: newData.stock?.name }}
				onSelectedChange={(v) => {
					if (v && !!v.value) {
						mapProduct(v.value);
					}
				}}
			>
				<Select.Trigger>
					<Select.Value placeholder="Select a product" />
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Label>Products</Select.Label>
						{#if !!$stockOverviewProducts && $stockOverviewProducts.length > 0}
							{#each $stockOverviewProducts as type}
								<Select.Item value={type} label={type.name}>{type.code} - {type.name}</Select.Item>
							{/each}
						{/if}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		</div>
		<div class="grid gap-3">
			<Label for="name">Margin</Label>
			<Input id="name" type="text" bind:value={newData.margin} class="w-full" />
		</div>
		<div class="grid gap-3">
			<Label for="unit">Margin Type</Label>
			<Select.Root
				selected={{ value: newData.marginType, label: newData.marginType }}
				onSelectedChange={(v) => {
					if (v && (v.value === 'Price' || v.value === 'Percent')) {
						newData.marginType = v.value;
					}
				}}
			>
				<Select.Trigger>
					<Select.Value placeholder="Select an Unit" />
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Label>Margin Type</Select.Label>
						{#each ['Percent', 'Price'] as type}
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
		disabled={newData.margin == 0 || !newData.marginType}
		on:click={() => {
			if (newData.id == '') delete newData.id;
			console.log(newData);
			if (newData.id == undefined) db.productMargin.add(newData);
			else db.productMargin.update(newData.id, { ...newData });
			toast.success('Product Margin  added successfully');
			componentSide.set(null);
		}}
		variant="default">Submit</Button
	>
</Card.Footer>
<!-- </Card.Root> -->
