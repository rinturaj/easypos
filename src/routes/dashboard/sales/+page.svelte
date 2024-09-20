<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { componentData, componentSide } from '../../../lib/component.store';
	import SaleOrder from '../../../lib/components/custom/saleOrder.svelte';
	import {
		CalendarIcon,
		Activity,
		Edit,
		Expand,
		File,
		ListFilter,
		ArrowUp,
		ArrowDown
	} from 'lucide-svelte';
	import { Trash } from 'svelte-radix';
	import { cn, toNumber } from '$lib/utils.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';

	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone
	} from '@internationalized/date';
	import SaleOrderView from '../../../lib/components/custom/saleOrderView.svelte';
	import { liveQuery } from 'dexie';
	import { db } from '../../../database/db';
	import type { SaleModel } from '../../../database/model';
	import { SaleOrder as SaleOrderClass } from '../../../database/model';
	import DatePickerWithRange from '../../../lib/components/custom/date-picker-with-range.svelte';
	import type { DateRange } from 'bits-ui';
	componentSide.set(null);

	function addComponent(sales?: SaleModel) {
		componentSide.set(SaleOrder);
		componentData.set(sales ?? new SaleOrderClass());
	}
	function viewSales(sales?: SaleModel) {
		componentSide.set(SaleOrderView);
		componentData.set(sales ?? new SaleOrderClass());
	}

	let onDelete = false;
	let deleteSale: SaleModel;

	$: salesList = liveQuery(async () => {
		console.log(startDate, endDate);
		if (sortDesc)
			return await db.sales
				.where('salesDate')
				.between(startDate, endDate, true, true)
				.reverse()
				.sortBy(sortBy);
		else
			return await db.sales
				.where('salesDate')
				.between(startDate, endDate, true, true)
				.sortBy(sortBy);
	});

	$: revenueMonth = $salesList
		? $salesList.reduce(
				(sum: any, x: SaleModel) => {
					return {
						revenue: Number(sum.revenue) + Number(x.actuals),
						discrepancy: Number(sum.discrepancy) + Number(x.discrepancy),
						collected: Number(sum.collected) + Number(x.totalCollection),
						inhand: Number(sum.inhand) + Number(x.inHand),
						credit: Number(sum.credit) + Number(x.credit),
						discrepancyPer: (
							((Number(sum.discrepancy) + Number(x.discrepancy)) * 100) /
							(Number(sum.revenue) + Number(x.actuals))
						).toFixed(2)
					};
				},
				{
					revenue: 0,
					discrepancy: 0,
					discrepancyPer: 0,
					collected: 0,
					inhand: 0,
					credit: 0
				}
			)
		: {
				revenue: 0,
				discrepancy: 0,
				collected: 0,
				inhand: 0,
				credit: 0,
				discrepancyPer: 0
			};
	$: totalDay = $salesList
		? $salesList
				.filter((x) => x.salesDate.getDate() == new Date().getDate())
				.reduce(
					(sum: any, x: SaleModel) => {
						return {
							revenue: Number(sum.revenue) + Number(x.actuals),
							discrepancy: Number(sum.discrepancy) + Number(x.discrepancy),
							collected: Number(sum.collected) + Number(x.totalCollection),
							inhand: Number(sum.inhand) + Number(x.inHand),
							credit: Number(sum.credit) + Number(x.credit),
							discrepancyPer: (
								((Number(sum.discrepancy) + Number(x.discrepancy)) * 100) /
								(Number(sum.revenue) + Number(x.actuals))
							).toFixed(2)
						};
					},
					{
						revenue: 0,
						discrepancy: 0,
						discrepancyPer: 0,
						collected: 0,
						inhand: 0,
						credit: 0
					}
				)
		: {
				revenue: 0,
				discrepancy: 0,
				collected: 0,
				inhand: 0,
				credit: 0
			};

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let dateValue: DateRange;
	let sortBy: string = 'salesDate';
	let sortDesc: boolean;

	$: startDate =
		dateValue != null && dateValue.start != null
			? dateValue.start?.toDate(getLocalTimeZone())
			: new Date();
	$: endDate =
		dateValue != null && dateValue.end != null
			? dateValue.end?.toDate(getLocalTimeZone())
			: new Date();
</script>

<div class="flex min-h-screen w-full flex-col bg-muted/40 p-4">
	<div class="grid auto-rows-max items-start gap-4 lg:col-span-2">
		<div class="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
			<Card.Root class="sm:col-span-2">
				<Card.Header class="pb-3">
					<Card.Title>Sales Module</Card.Title>
					<Card.Description class="max-w-lg text-balance leading-relaxed">
						Manage your sales efficiently with our comprehensive dashboard for real-time insights
						and analytics.
					</Card.Description>
				</Card.Header>
				<Card.Footer>
					<Button on:click={() => addComponent()}>Add New Sale</Button>
				</Card.Footer>
			</Card.Root>
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Description>Today's</Card.Description>
					<Card.Title class="currency text-4xl">{totalDay.collected}</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-xs {totalDay.discrepancyPer < 0 ? 'text-red-500' : 'text-green-700'}">
						{totalDay.discrepancyPer}% discrepancy
					</div>
				</Card.Content>
				<Card.Footer>
					<Progress
						value={(totalDay.collected / totalDay.revenue) * 100}
						aria-label="25% increase"
					/>
				</Card.Footer>
			</Card.Root>
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Description>Selected Date Range</Card.Description>
					<Card.Title class="currency text-3xl">{revenueMonth.collected}</Card.Title>
				</Card.Header>
				<Card.Content>
					<div
						class="text-xs {revenueMonth.discrepancyPer < 0 ? 'text-red-500' : 'text-green-700'}"
					>
						{revenueMonth.discrepancyPer}% discrepancy
					</div>
				</Card.Content>
				<Card.Footer>
					<Progress
						value={(revenueMonth.collected / revenueMonth.revenue) * 100}
						aria-label="12% increase"
					/>
				</Card.Footer>
			</Card.Root>
		</div>

		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Total Revenue</Card.Title>
					<!-- <DollarSign class="h-4 w-4 text-muted-foreground" /> -->
				</Card.Header>
				<Card.Content>
					<div class="currency text-2xl font-bold">{revenueMonth.revenue}</div>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm  font-medium">Collection</Card.Title>
					<!-- <Users class="h-4 w-4 text-muted-foreground" /> -->
				</Card.Header>
				<Card.Content>
					<div class="currency text-2xl font-bold">{revenueMonth.collected}</div>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Credit</Card.Title>
					<!-- <CreditCard class="h-4 w-4 text-muted-foreground" /> -->
				</Card.Header>
				<Card.Content>
					<div class="currency text-2xl font-bold">{revenueMonth.credit}</div>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Discrepancy</Card.Title>
					<Activity class="h-4 w-4 text-muted-foreground" />
				</Card.Header>
				<Card.Content>
					<div class="currency text-2xl font-bold">{revenueMonth.discrepancy}</div>
				</Card.Content>
			</Card.Root>
		</div>
		<!-- <div class="flex items-center">
			<div></div>
			<div class="ml-auto flex items-center gap-2">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button variant="outline" size="sm" class="h-7 gap-1 text-sm" builders={[builder]}>
							<ListFilter class="h-3.5 w-3.5" />
							<span class="sr-only sm:not-sr-only">Sort By</span>
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end">
						<DropdownMenu.Label>Sort by</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.Item
							on:click={() => {
								sortBy = 'Name';
								sortDesc = !sortDesc;
							}}>Name</DropdownMenu.Item
						>
						<DropdownMenu.Item
							on:click={() => {
								sortBy = 'Date';
								sortDesc = !sortDesc;
							}}>Date</DropdownMenu.Item
						>
						<DropdownMenu.Item
							on:click={() => {
								sortBy = 'Collection';
								sortDesc = !sortDesc;
							}}
						>
							Collection</DropdownMenu.Item
						>
						<DropdownMenu.Item
							on:click={() => {
								sortBy = 'Discrepancy';
								sortDesc = !sortDesc;
							}}>Discrepancy</DropdownMenu.Item
						>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
				<Button size="sm" variant="outline" class="h-7 gap-1 text-sm">
					<File class="h-3.5 w-3.5" />
					<span class="sr-only sm:not-sr-only">Export</span>
				</Button>
			</div>
		</div> -->
		<Card.Root>
			<Card.Header class="flex flex-row justify-between px-7">
				<div>
					<Card.Title
						>Sale Details for {df.format(
							dateValue?.start?.toDate(getLocalTimeZone()) ?? new Date()
						)} - {df.format(dateValue?.end?.toDate(getLocalTimeZone()) ?? new Date())}</Card.Title
					>
					<Card.Description>
						Selected Date Range Sales are shown. Choose earlier date for previous month's details.
					</Card.Description>
				</div>
				<div>
					<DatePickerWithRange bind:value={dateValue} />
				</div>
			</Card.Header>
			<Card.Content>
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head
								><Button
									on:click={() => {
										sortBy = 'employeeName';
										sortDesc = !sortDesc;
									}}
									variant="ghost"
								>
									{#if sortDesc && sortBy == 'employeeName'}
										<ArrowUp size={13} />
									{:else}
										<ArrowDown size={13} />
									{/if}
									Name
								</Button>
							</Table.Head>
							<Table.Head class="hidden sm:table-cell"
								><Button
									on:click={() => {
										sortBy = 'salesDate';
										sortDesc = !sortDesc;
									}}
									variant="ghost"
								>
									{#if sortDesc && sortBy == 'salesDate'}
										<ArrowUp size={13} />
									{:else}
										<ArrowDown size={13} />
									{/if}
									Date
								</Button>
							</Table.Head>
							<Table.Head class="hidden sm:table-cell">Shift Time</Table.Head>
							<Table.Head class="hidden md:table-cell">Credit</Table.Head>
							<Table.Head class=" hidden md:table-cell">
								<Button
									on:click={() => {
										sortBy = 'totalCollection';
										sortDesc = !sortDesc;
									}}
									variant="ghost"
								>
									{#if sortDesc && sortBy == 'totalCollection'}
										<ArrowUp size={13} />
									{:else}
										<ArrowDown size={13} />
									{/if}
									Collection
								</Button>
							</Table.Head>
							<Table.Head class="  md:table-cell">Total</Table.Head>
							<Table.Head class="  md:table-cell">
								<Button
									on:click={() => {
										sortBy = 'discrepancy';
										sortDesc = !sortDesc;
									}}
									variant="ghost"
								>
									{#if sortDesc && sortBy == 'discrepancy'}
										<ArrowUp size={13} />
									{:else}
										<ArrowDown size={13} />
									{/if}
									Discrepancy
								</Button>
							</Table.Head>
							<Table.Head class="  text-right">Action</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#if !!$salesList && $salesList.length > 0}
							{#each $salesList as sales}
								<Table.Row class="">
									<Table.Cell>
										<div class="font-medium">{sales.employeeName}</div>
									</Table.Cell>
									<Table.Cell class="hidden sm:table-cell">
										{df.format(sales.salesDate)}
									</Table.Cell>
									<Table.Cell class="hidden sm:table-cell">
										<Badge class="mx-1 text-xs" variant="default">{sales.checkIn}</Badge>-
										<Badge class="text-xs" variant="default">{sales.checkOut}</Badge>
										| {sales.totalHours} Hours
									</Table.Cell>
									<Table.Cell class="currency hidden md:table-cell"
										>{toNumber(sales.credit)}</Table.Cell
									>
									<Table.Cell class="currency hidden md:table-cell"
										>{toNumber(sales.totalCollection)}</Table.Cell
									>
									<Table.Cell class="currency hidden md:table-cell"
										>{toNumber(sales.actuals)}</Table.Cell
									>
									<Table.Cell
										class="hidden {sales.discrepancy >= 0
											? 'text-green-600'
											: 'text-red-600'} currency md:table-cell"
										>{sales.discrepancy > 0 ? '+' : ''}{sales.discrepancy}</Table.Cell
									>
									<Table.Cell class="text-right">
										<Button on:click={() => addComponent(sales)} size="icon" variant="ghost">
											<Edit size={16}></Edit>
										</Button>
										<Button on:click={() => viewSales(sales)} size="icon" variant="outline">
											<Expand size={16}></Expand>
										</Button>
										<Button
											on:click={() => {
												deleteSale = sales;
												onDelete = true;
											}}
											size="icon"
											variant="destructive"
										>
											<Trash size={16}></Trash>
										</Button>
									</Table.Cell>
								</Table.Row>
							{/each}
						{:else}
							<Table.Row>
								<Table.Cell colspan={6} class="mt-4 pt-4 text-center font-medium">
									<div class="flex flex-col items-center">
										<div class="text-2xl font-bold text-gray-700">No Sales Data Available</div>
										<p class="mt-2 text-gray-500">Please add some sales data to get started.</p>
										<Button class="mt-3" on:click={() => addComponent()}>Add New Sale</Button>
									</div>
								</Table.Cell>
							</Table.Row>
						{/if}
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>
	</div>
</div>

<AlertDialog.Root bind:open={onDelete}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete from your system.
				<p class="text-red-500">{deleteSale.employeeName}</p>
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel
				on:click={() => {
					onDelete = false;
				}}>Cancel</AlertDialog.Cancel
			>
			<AlertDialog.Action
				on:click={() => {
					db.sales.delete(deleteSale.id);
					onDelete = false;
				}}>Continue</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
