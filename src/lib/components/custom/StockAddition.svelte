<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { componentSide } from '../../component.store';
	import Button from '../ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import { parseUnit, type Product, type ProductStock, type Unit } from '../../../database/model';
	import { db } from '../../../database/db';
	import { toast } from 'svelte-sonner';
	import { liveQuery } from 'dexie';
	import { format } from 'date-fns/format';

	export let data;

	$: productList = liveQuery(async () => {
		return await db.product.toArray();
	});

	let newData: ProductStock = {
		code: '',
		createdOn: new Date(),
		updatedOn: new Date(),
		name: '',
		unit: 'gram',
		purchasedOn: new Date(),
		purchaseRate: 0,
		quantity: 0
	};

	$: if (!!data) {
		console.log(data);
		newData = data;
	}
	$: formattedStockDate = format(newData.purchasedOn, 'yyyy-MM-dd');

	function mapProduct(p: any) {
		if (!!p.name && !!p.code && !!p.unit) {
			newData.name = p.name;
			newData.code = p.code;
			newData.unit = parseUnit(p.unit);
		}
	}

	function handleDateChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const selectedDate = new Date(input.value);
		if (!isNaN(selectedDate.getTime())) {
			newData.purchasedOn = selectedDate;
		}
	}
</script>

<!-- <Card.Root> -->
<Card.Header>
	<Card.Title>Product Purchase Update/Insert</Card.Title>
</Card.Header>
<Card.Content>
	<div class="grid gap-6">
		<div class="grid gap-3">
			<Label for="unit">Product</Label>
			<Select.Root
				selected={{ value: newData, label: newData.name }}
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
						{#if !!$productList && $productList.length > 0}
							{#each $productList as type}
								<Select.Item value={type} label={type.name}>{type.code} - {type.name}</Select.Item>
							{/each}
						{/if}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		</div>
		<div class="grid gap-3">
			<Label for="stockDate">Purchase Date</Label>
			<Input
				id="stockDate"
				value={formattedStockDate}
				on:input={handleDateChange}
				type="date"
				class="block"
				placeholder="Select date"
			/>
		</div>
		<div class="grid gap-3">
			<Label for="name">Quantity is in {newData.unit}</Label>
			<Input id="name" type="number" bind:value={newData.quantity} class="w-full" />
		</div>
		<div class="grid gap-3">
			<Label for="name">Amount</Label>
			<Input id="name" type="number" bind:value={newData.purchaseRate} class="w-full" />
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
		disabled={newData.name == '' ||
			newData.code == '' ||
			newData.purchaseRate == 0 ||
			newData.quantity == 0 ||
			newData.purchasedOn == null}
		on:click={() => {
			if (newData.id == '') delete newData.id;
			console.log(newData);
			if (newData.id == undefined) db.productStock.add(newData);
			else db.productStock.update(newData.id, { ...newData });
			toast.success('Stock  added successfully');
			componentSide.set(null);
		}}
		variant="default">Submit</Button
	>
</Card.Footer>
<!-- </Card.Root> -->
