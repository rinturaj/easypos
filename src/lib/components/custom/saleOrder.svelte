<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { componentSide } from '../../component.store';
	import Button from '../ui/button/button.svelte';
	import Separator from '../ui/separator/separator.svelte';
	import ScrollArea from '../ui/scroll-area/scroll-area.svelte';
	import { db } from '../../../database/db';
	import { liveQuery } from 'dexie';
	import {
		Reading,
		SaleOrder,
		type Nosil,
		type Readings,
		type SaleModel
	} from '../../../database/model';
	import { format } from 'date-fns';
	import { Trash2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import type { Selected } from 'bits-ui';
	import { toNumber } from '../../utils';

	export let data: SaleModel;
	let sale: SaleModel = new SaleOrder();

	$: if (!!data) {
		console.log(data);
		sale = data;
	}

	let selectedNosil: Selected<any> = {
		label: '',
		value: ''
	};

	$: if (!!sale.checkIn && !!sale.checkOut) {
		console.log(sale.checkIn, sale.checkOut);
		const checkInTime = new Date(`1970-01-01T${sale.checkIn}:00`);
		let checkOutTime = new Date(`1970-01-01T${sale.checkOut}:00`);
		if (checkOutTime < checkInTime) {
			checkOutTime.setDate(checkOutTime.getDate() + 1);
		}
		sale.totalHours = Number(
			(Math.abs(checkOutTime.getTime() - checkInTime.getTime()) / 36e5).toFixed(2)
		);
	}

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
	let reading: Readings = new Reading();
	$: price = liveQuery(async () => {
		let p = await db.price.get(1);
		if (p) {
			sale.petrolPrice = p.petrol;
			sale.dieselPrice = p.diesel;
		}
		return p;
	});

	$: nosilList = liveQuery(async () => {
		return await db.nosil.toArray();
	});
	$: staffs = liveQuery(async () => {
		return (await db.staff.toArray()).filter((x) => x.status === true);
	});

	$: formattedStockDate = format(sale.salesDate, 'yyyy-MM-dd');

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
		if (Number(reading.closingReadings) < Number(reading.openingReadings)) {
			toast.error('Closing reading should be less than opening');
			return;
		}

		const ns = $nosilList.find((x) => x.name === reading.nosil);
		console.log(ns);

		if (ns != null) {
			ns.reading = reading.closingReadings;
			await db.nosil.update(ns.id, { ...ns });
		}

		sale.readings.push(reading.build());
		sale.actuals = sale.readings.reduce((pv, cv) => toNumber(cv.totalPrice + pv), 0);
		reading = new Reading();
		selectedNosil = {
			label: '',
			value: ''
		};
		sale = sale;
	}

	async function deleteReading(rd: Readings) {
		// Remove the reading from the sale's readings array
		sale.readings = sale.readings.filter((r) => r !== rd);
		// Recalculate the actuals after deletion
		sale.actuals = sale.readings.reduce((pv, cv) => toNumber(cv.totalPrice + pv), 0);

		sale = sale;

		const ns = $nosilList.find((x) => x.name === rd.nosil);
		console.log(ns);

		if (ns != null) {
			ns.reading = rd.openingReadings;
			await db.nosil.update(ns.id, { ...ns });
		}

		selectedNosil = {
			label: '',
			value: ''
		};
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
				<Label for="name"
					>Petrol Price (Today's Price <span class="currency text-green-800"
						>{$price?.petrol}
					</span>
				</Label>
				<Input
					id="name"
					type="number"
					class="block"
					placeholder="price "
					bind:value={sale.petrolPrice}
				/>
			</div>
			<div class="grid gap-3">
				<Label for="name"
					>Diesel Price (Today's Price <span class="currency text-green-800"
						>{$price?.diesel}
					</span> )</Label
				>
				<Input
					id="name"
					type="number"
					class="block"
					placeholder="price "
					bind:value={sale.dieselPrice}
				/>
			</div>
		</div>

		<div class="grid grid-cols-2 grid-rows-1 gap-4 pt-3">
			<div class=" border-r pr-4">
				<div class="grid gap-2">
					<!-- <div class="grid gap-3">
                        <Calendar class="rounded-md border shadow" />
                    </div> -->

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

					<div class="grid grid-cols-2 gap-2">
						<div class="grid gap-3">
							<Label for="name">Check In</Label>
							<Input
								id="name"
								class="block"
								type="time"
								placeholder="price "
								bind:value={sale.checkIn}
							/>
						</div>
						<div class="grid gap-3">
							<Label for="name">Check Out</Label>
							<Input
								id="name"
								class="block"
								type="time"
								placeholder="price "
								bind:value={sale.checkOut}
							/>
						</div>
					</div>
					<div class="grid grid-cols-2 rounded-lg border bg-gray-100 p-2">
						<div class="grid gap-2 text-muted-foreground">Total Hours</div>
						<div class="grid gap-2 text-center font-extrabold">
							{sale.totalHours} hours
						</div>
					</div>
				</div>
			</div>
			<div class="grid gap-6">
				<div class="grid gap-3">
					<Label for="name">Nosil</Label>
					<Select.Root
						selected={selectedNosil}
						onSelectedChange={(v) => {
							const ns = $nosilList.find((x) => x.id === v?.value);
							if (ns) {
								reading.nosil = ns?.name;
								reading.type = ns?.type;
								reading.openingReadings = ns.reading;
								reading.unitPrice =
									(reading.type == 'petrol' ? $price?.petrol : $price?.diesel) || 0;
							}
						}}
					>
						<Select.Trigger>
							<Select.Value placeholder="Select" />
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								<Select.Label>Nosil</Select.Label>

								{#if !!$nosilList && $nosilList.length > 0}
									{#each $nosilList as ns}
										<Select.Item value={ns.id} label={ns.name}>{ns.name}</Select.Item>
									{/each}
								{/if}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</div>
				<div class="grid grid-cols-4 items-end gap-2">
					<div class="grid gap-3">
						<Label for="name">Opening</Label>
						<Input
							id="name"
							class="block"
							type="number"
							placeholder="Reading "
							bind:value={reading.openingReadings}
						/>
					</div>
					<div class="grid gap-3">
						<Label for="name">Closing</Label>
						<Input
							id="name"
							class="block"
							type="number"
							placeholder="Reading "
							bind:value={reading.closingReadings}
						/>
					</div>
					<div class="grid gap-3">
						<Label for="name">Test</Label>
						<Input
							id="name"
							class="block"
							type="number"
							placeholder="Reading "
							bind:value={reading.testLiter}
						/>
					</div>
					<div class="grid gap-3">
						<Button
							disabled={reading.openingReadings == 0 ||
								reading.closingReadings == 0 ||
								reading.openingReadings > reading.closingReadings}
							on:click={addReading}>Add</Button
						>
					</div>
				</div>
			</div>
		</div>
		<ScrollArea class="w-100 mt-6 h-48 rounded-lg bg-slate-100 p-2">
			<h6 class="sticky font-extrabold">Reading</h6>

			{#each sale.readings as rd}
				<div class="my-2 grid grid-cols-7 gap-2 rounded-lg border p-2">
					<div>
						<h6 class=" text-xs text-muted-foreground">Nossil</h6>
						<h6 class="text-sm font-semibold text-black">{rd.nosil}</h6>
					</div>
					<!-- <div>
						<h6 class=" text-xs text-muted-foreground">Type</h6>
						<h6 class="text-sm font-semibold text-black">Petrol</h6>
					</div> -->
					<div>
						<h6 class=" text-xs text-muted-foreground">Opening</h6>
						<h6 class="text-sm font-semibold text-black">{rd.openingReadings}</h6>
					</div>
					<div>
						<h6 class=" text-xs text-muted-foreground">Closing</h6>
						<h6 class="text-sm font-semibold text-black">{rd.closingReadings}</h6>
					</div>
					<div>
						<h6 class=" text-xs text-muted-foreground">Total Liter (A)</h6>
						<h6 class="text-sm font-semibold text-orange-400">{rd.totalLitre}</h6>
					</div>
					<div>
						<h6 class=" text-xs text-muted-foreground">Test Liter (B)</h6>
						<h6 class="text-sm font-semibold text-orange-400">{rd.testLiter}</h6>
					</div>
					<div class="text-right">
						<h6 class=" text-xs text-muted-foreground">
							Total (A-B) {rd.grossTotalLitre}L x <span class="currency">{rd.unitPrice}</span>
						</h6>
						<h6 class="currency text-sm font-semibold text-green-600">{rd.totalPrice}</h6>
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
					sale.readings.reverse().forEach(async (readings) => {
						const ns = $nosilList.find((x) => x.name === readings.nosil);
						console.log(ns);
						if (ns != null) {
							ns.reading = readings.openingReadings;
							await db.nosil.update(ns.id, { ...ns });
						}
					});

					componentSide.set(null);
				}}
				variant="outline"
				class="mr-3">Cancel</Button
			>
			<Button
				disabled={!(
					sale.readings.length > 0 &&
					!!sale.checkIn &&
					!!sale.checkOut &&
					sale.employeeId > 0
				)}
				on:click={() => {
					if (sale.employeeId <= 0) {
						toast.error(' employee details is not available');
						return;
					}

					if (sale.readings.length <= 0) {
						toast.error(' Reading should not be empty');
						return;
					}

					if (sale.id == 0) delete sale.id;
					console.log(sale);
					if (sale.id == undefined) db.sales.add(sale);
					else db.sales.update(sale.id, { ...sale });

					componentSide.set(null);
					toast.success('Sales  added successfully');
				}}>Submit</Button
			>
		</div>
	</Card.Footer>
	<!-- </xCard.Root> -->
</div>
