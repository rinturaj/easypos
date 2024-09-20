<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { componentSide } from '../../component.store';
	import Button from '../ui/button/button.svelte';
	import Calendar from '../ui/calendar/calendar.svelte';
	import type { Stock } from '../../../database/model';
	import { format } from 'date-fns';
	import { db } from '../../../database/db';
	import { toast } from 'svelte-sonner';

	let newData: Stock = {
		closingStock: 0,
		dipStock: 0,
		createdOn: new Date(),
		openingStock: 0,
		stockDate: new Date(),
		type: ''
	};

	$: formattedStockDate = format(newData.stockDate, 'yyyy-MM-dd');

	function handleDateChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const selectedDate = new Date(input.value);
		if (!isNaN(selectedDate.getTime())) {
			newData.stockDate = selectedDate;
		}
		getLastDateStock();
	}

	async function getLastDateStock() {
		if (newData.stockDate == null) return;
		if (newData.type == '') return;

		const yesterday = new Date(newData.stockDate);
		yesterday.setDate(yesterday.getDate() - 1);
		const yesterdayStart = new Date(yesterday.setHours(0, 0, 0, 0));
		const yesterdayEnd = new Date(yesterday.setHours(23, 59, 59, 999));

		let lastStock = await db.stock
			.where('stockDate')
			.between(yesterdayStart, yesterdayEnd)
			.and((stock) => stock.type === newData.type)
			.first();
		console.log(lastStock);

		if (lastStock == undefined) {
			newData.openingStock = 0;
			return;
		}

		newData.openingStock = lastStock.closingStock;
	}

	let add = () => {
		db.stock.add(newData);
		componentSide.set(null);
		toast.success('Stock added successfully');
	};
</script>

<div class="w-full p-3">
	<!-- <Card.Root> -->
	<Card.Header>
		<Card.Title>Add Stock</Card.Title>
		<Card.Description>Create or update stock details</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="grid gap-6">
			<div class="grid gap-3">
				<Label for="stockDate">Date</Label>
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
				<Label for="name">Type</Label>
				<Select.Root
					onSelectedChange={(v) => {
						v && (newData.type = '' + v.value);
						getLastDateStock();
					}}
				>
					<Select.Trigger>
						<Select.Value placeholder="Choose Type" />
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Type</Select.Label>
							{#each ['petrol', 'diesel'] as type}
								<Select.Item value={type} label={type}>{type}</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>

			<div class="grid gap-3">
				<Label for="name">Opening Stock</Label>
				<Input
					id="name"
					type="number"
					bind:value={newData.openingStock}
					class="w-full"
					placeholder="price "
				/>
			</div>
			<div class="grid gap-3">
				<Label for="name">Dip Stock</Label>
				<Input
					id="name"
					type="number"
					bind:value={newData.dipStock}
					class="w-full"
					placeholder="price "
				/>
			</div>
			<div class="grid gap-3">
				<Label for="name">Closing Stock</Label>
				<Input
					id="name"
					type="number"
					bind:value={newData.closingStock}
					class="w-full"
					placeholder="price "
				/>
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
			disabled={newData.type == '' ||
				newData.closingStock == 0 ||
				newData.dipStock == 0 ||
				newData.openingStock == 0}
			on:click={add}>Add</Button
		>
	</Card.Footer>
	<!-- </Card.Root> -->
</div>
