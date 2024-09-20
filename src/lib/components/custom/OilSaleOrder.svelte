<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input, type FormInputEvent } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { componentSide } from '../../component.store';
	import Button from '../ui/button/button.svelte';
	import ScrollArea from '../ui/scroll-area/scroll-area.svelte';
	import { db } from '../../../database/db';
	import { liveQuery } from 'dexie';
	import {
		type OliSalesModel,
		type OilItem,
		OilItemClass,
		OliSalesModelClass
	} from '../../../database/model';
	import { format } from 'date-fns';
	import { Trash2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { toNumber } from '../../utils';

	export let data: OliSalesModel;
	let sale: OliSalesModel = new OliSalesModelClass();

	$: if (!!data) {
		console.log(data);
		sale = data;
	}

	let item: OilItem = new OilItemClass();

	$: staffs = liveQuery(async () => {
		return (await db.staff.toArray()).filter((x) => x.status === true);
	});
	$: oilListName = liveQuery(async () => {
		return [...new Set((await db.oil.toArray()).map((x) => x.name))];
	});
	$: formattedStockDate = format(sale.salesDate, 'yyyy-MM-dd');

	$: if (
		sale.byCash > 0 ||
		sale.hpPay > 0 ||
		sale.upiPayment > 0 ||
		sale.card > 0 ||
		sale.credit > 0
	) {
		sale.totalCollection =
			toNumber(sale.byCash) +
			toNumber(sale.upiPayment) +
			toNumber(sale.hpPay) +
			toNumber(sale.card) +
			toNumber(sale.credit);
		sale.inHand = toNumber(sale.totalCollection) - toNumber(sale.credit);
		sale.discrepancy = toNumber(sale.totalCollection - sale.actuals);
		sale = sale;
	}
	function handleDateChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const selectedDate = new Date(input.value);
		console.log(isNaN(selectedDate.getTime()));

		if (!isNaN(selectedDate.getTime())) {
			sale.salesDate = selectedDate;
		}
		console.log(sale.salesDate, selectedDate);
	}
	async function addReading() {
		if (Number(item.unitPrice) == 0) {
			toast.error('item size/unitprice/quantity is not a number');
			return;
		}

		sale.items.push(item.build());
		sale.actuals = sale.items.reduce((pv, cv) => cv.amount + pv, 0);
		item = new OilItemClass();
		sale = sale;
	}

	async function deleteReading(rd: OilItem) {
		// Remove the reading from the sale's readings array
		sale.items = sale.items.filter((r) => r !== rd);
		// Recalculate the actuals after deletion
		sale.actuals = sale.items.reduce((pv, cv) => cv.amount + pv, 0);
		sale = sale;
	}

	async function onItemNameChange(e: Event) {
		if (!e.target) return;
		const input = e.target as HTMLInputElement;
		const value = input.value;

		if (!value) return;

		const oil = await db.oil.where('name').equals(value).toArray();

		if (!oil) return;
		let o = oil.pop();
		item.unitPrice = o?.unitPrice ?? 0;
	}
</script>

<div class="w-full">
	<!-- <Card.Root> -->
	<Card.Header>
		<Card.Title>New Sale</Card.Title>
		<Card.Description>Create new sale</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="grid grid-cols-3 gap-3 rounded-lg border bg-slate-100 p-2">
			<div class="grid gap-3">
				<Label for="name">Date</Label>
				<Input
					id="name"
					value={formattedStockDate}
					on:input={handleDateChange}
					type="date"
					class="block"
					placeholder="price "
				/>
			</div>
			<div class="grid gap-3">
				<Label for="name">Employee</Label>
				<Select.Root
					selected={{ value: sale.employeeId, label: sale.employeeName }}
					onSelectedChange={(v) => {
						const staff = $staffs.find((x) => x.id === v?.value);
						if (staff) {
							sale.employeeName = staff.name;
							sale.employeeId = staff.id ?? 0;
						}
					}}
				>
					<Select.Trigger>
						<Select.Value placeholder="Select an Employees" />
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Select Employees</Select.Label>
							{#if !!$staffs && $staffs.length > 0}
								{#each $staffs as stf}
									<Select.Item value={stf.id} label={stf.name}>{stf.name}</Select.Item>
								{/each}
							{/if}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>
		</div>

		<div class="grid grid-cols-1 grid-rows-1 gap-4 pt-3">
			<div class="grid gap-6">
				<div class="grid gap-3">
					<Label for="name">Name</Label>
					<Input
						id="name"
						bind:value={item.name}
						type="text"
						list="browsers"
						class="w-full"
						on:change={onItemNameChange}
						autocomplete="off"
						placeholder="Item name here"
					/>

					<datalist id="browsers">
						{#if !!$oilListName && $oilListName.length > 0}
							{#each $oilListName as name}
								<option value={name}> {name}</option>
							{/each}
						{/if}
					</datalist>
				</div>
				<div class="grid grid-cols-3 items-end gap-2">
					<div class="grid gap-3">
						<Label for="name">Quantity</Label>
						<Input
							id="name"
							class="block"
							type="number"
							placeholder="Quantity "
							bind:value={item.quantity}
						/>
					</div>
					<div class="grid gap-3">
						<Label for="name">Unit Price</Label>
						<Input
							id="name"
							class="block"
							type="number"
							placeholder="unitPrice "
							bind:value={item.unitPrice}
						/>
					</div>

					<div class="grid gap-3">
						<Button disabled={item.unitPrice == 0 || item.quantity == 0} on:click={addReading}>
							<span class="currency mx-3">
								{Number(item.unitPrice * item.quantity).toFixed(2)}
							</span>
							Add</Button
						>
					</div>
				</div>
			</div>
		</div>
		<ScrollArea class="w-100 mt-6 h-48 rounded-lg bg-slate-100 p-2">
			<h6 class="sticky font-extrabold">Items</h6>

			{#each sale.items as rd}
				<div class="my-2 grid grid-cols-6 gap-2 rounded-lg border p-2">
					<div>
						<h6 class=" text-xs text-muted-foreground">Item Name</h6>
						<h6 class="text-sm font-semibold text-black">{rd.name}</h6>
					</div>
					<!-- <div>
						<h6 class=" text-xs text-muted-foreground">Type</h6>
						<h6 class="text-sm font-semibold text-black">Petrol</h6>
					</div> -->
					<div>
						<h6 class=" text-xs text-muted-foreground">Size</h6>
						<h6 class="text-sm font-semibold text-black">{rd.unit}</h6>
					</div>
					<div>
						<h6 class=" text-xs text-muted-foreground">Quantity</h6>
						<h6 class="text-sm font-semibold text-black">{rd.quantity}</h6>
					</div>
					<div>
						<h6 class=" text-xs text-muted-foreground">Unit Price</h6>
						<h6 class="currency text-sm font-semibold text-black">{rd.unitPrice}</h6>
					</div>

					<div class="text-right">
						<h6 class=" text-xs text-muted-foreground">
							Total {rd.unit}mL x <span class="currency">{rd.unitPrice}</span> x
							<span class="">{rd.quantity}</span> =
						</h6>
						<h6 class="currency text-sm font-semibold text-green-600">{rd.amount}</h6>
					</div>
					<div class="text-right">
						<Button on:click={() => deleteReading(rd)} size="icon" variant="destructive">
							<Trash2 size={16} />
						</Button>
					</div>
				</div>
			{/each}
		</ScrollArea>
		<h6 class="sticky pb-3 font-extrabold">Collection</h6>

		<div class="grid grid-cols-5 gap-2">
			<div class="grid gap-1">
				<Label for="name">By Cash</Label>
				<Input
					id="name"
					class="block"
					type="number"
					placeholder="Reading "
					bind:value={sale.byCash}
				/>
			</div>
			<div class="grid gap-1">
				<Label for="name">UPI</Label>
				<Input
					id="name"
					class="block"
					type="number"
					placeholder="Reading "
					bind:value={sale.upiPayment}
				/>
			</div>
			<div class="grid gap-1">
				<Label for="name">Card</Label>
				<Input
					id="name"
					class="block"
					type="number"
					placeholder="Reading "
					bind:value={sale.card}
				/>
			</div>
			<div class="grid gap-1">
				<Label for="name">HP Pay</Label>
				<Input
					id="name"
					class="block"
					type="number"
					placeholder="Reading "
					bind:value={sale.hpPay}
				/>
			</div>
			<div class="grid gap-1">
				<Label for="name">Credit</Label>
				<Input
					id="name"
					class="block"
					type="number"
					placeholder="Reading "
					bind:value={sale.credit}
				/>
			</div>
		</div>
	</Card.Content>
	<Card.Footer class="flex justify-between">
		<div class="grid grid-cols-5 gap-2">
			<div class="grid">
				<h6 class=" text-xs text-muted-foreground">System Calculated Amount</h6>
				<h6 class="currency text-sm font-semibold">{toNumber(sale.actuals)}</h6>
			</div>
			<div class="grid">
				<h6 class=" text-xs text-muted-foreground">Total Collection</h6>
				<h6 class="currency text-sm font-semibold">{toNumber(sale.totalCollection)}</h6>
			</div>
			<div class="grid">
				<h6 class=" text-xs text-muted-foreground">In Hand</h6>
				<h6 class="currency text-sm font-semibold">{toNumber(sale.inHand)}</h6>
			</div>
			<div class="grid">
				<h6 class=" text-xs text-muted-foreground">Credit</h6>
				<h6 class="currency text-sm font-semibold">{toNumber(sale.credit)}</h6>
			</div>
			<div class="grid">
				<h6 class=" text-xs text-muted-foreground">Difference</h6>
				<h6
					class="currency text-sm font-extrabold {sale.discrepancy >= 0
						? 'text-green-600'
						: 'text-red-600'}"
				>
					{sale.discrepancy}
				</h6>
			</div>
		</div>
		<div>
			<Button
				on:click={() => {
					componentSide.set(null);
				}}
				variant="outline"
				class="mr-3">Cancel</Button
			>
			<Button
				disabled={!(
					sale.actuals > 0 &&
					sale.totalCollection > 0 &&
					sale.items.length > 0 &&
					sale.employeeId > 0
				)}
				on:click={() => {
					if (sale.employeeId <= 0) {
						toast.error(' employee details is not available');
						return;
					}

					if (sale.items.length <= 0) {
						toast.error(' Reading should not be empty');
						return;
					}

					if (sale.id == 0) delete sale.id;

					if (sale.id == undefined) db.oilsales.add(sale);
					else db.oilsales.update(sale.id, { ...sale });

					componentSide.set(null);
					toast.success('Sales  added successfully');
				}}>Submit</Button
			>
		</div>
	</Card.Footer>
	<!-- </xCard.Root> -->
</div>
