<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { componentData, componentSide } from '../../../lib/component.store';
	import SaleOrder from '../../../lib/components/custom/saleOrder.svelte';
	import { CalendarIcon, Edit, Expand } from 'lucide-svelte';
	import { Trash } from 'svelte-radix';
	import { cn } from '$lib/utils.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone
	} from '@internationalized/date';
	import SaleOrderView from '../../../lib/components/custom/saleOrderView.svelte';
	import { liveQuery } from 'dexie';
	import { db } from '../../../database/db';
	import type { OliSalesModel, SaleModel } from '../../../database/model';
	import { OliSalesModelClass, SaleOrder as SaleOrderClass } from '../../../database/model';
	import OilSaleOrder from '../../../lib/components/custom/OilSaleOrder.svelte';
	import OilSaleOrderView from '../../../lib/components/custom/OilSaleOrderView.svelte';
	componentSide.set(null);

	function addComponent(oilSales?: OliSalesModel) {
		componentSide.set(OilSaleOrder);
		componentData.set(oilSales ?? new OliSalesModelClass());
	}
	function viewoilSales(oilSales?: OliSalesModel) {
		componentSide.set(OilSaleOrderView);
		componentData.set(oilSales ?? new OliSalesModelClass());
	}

	let onDelete = false;
	let deleteSale: OliSalesModel;

	$: oilSalesList = liveQuery(async () => {
		return await db.oilsales.where('salesDate').between(startDate, endDate, true, true).toArray();
	});

	$: revenueMonth = $oilSalesList
		? $oilSalesList.reduce(
				(sum: any, x: OliSalesModel) => {
					return {
						revenue: Number(sum.revenue) + Number(x.actuals)
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
	$: totalDay = $oilSalesList
		? $oilSalesList
				.filter((x) => x.salesDate.getDate() == new Date().getDate())
				.reduce(
					(sum: any, x: OliSalesModel) => {
						return {
							revenue: Number(sum.revenue) + Number(x.actuals)
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
	new Date().getMonth();
	let value: DateValue = new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, 1);
	console.log(value.calendar.getDaysInMonth(value));

	$: startDate = value.toDate(getLocalTimeZone());
	$: endDate = new CalendarDate(value.year, value.month + 1, 1).toDate(getLocalTimeZone());
</script>

<div class="flex min-h-screen w-full flex-col bg-muted/40 p-4">
	<div class="grid auto-rows-max items-start gap-4 lg:col-span-2">
		<div class="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
			<Card.Root class="sm:col-span-2">
				<Card.Header class="pb-3">
					<Card.Title>oilSales Module</Card.Title>
					<Card.Description class="max-w-lg text-balance leading-relaxed">
						Manage your oilSales efficiently with our comprehensive dashboard for real-time insights
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
					<Card.Title class="currency text-4xl">{totalDay.revenue}</Card.Title>
				</Card.Header>
				<Card.Content></Card.Content>
				<Card.Footer>
					<Progress value={25} aria-label="25% increase" />
				</Card.Footer>
			</Card.Root>
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Description>This Month</Card.Description>
					<Card.Title class="currency text-3xl">{revenueMonth.revenue}</Card.Title>
				</Card.Header>
				<Card.Content></Card.Content>
				<Card.Footer>
					<Progress value={12} aria-label="12% increase" />
				</Card.Footer>
			</Card.Root>
		</div>
		<div class="flex items-center">
			<div></div>
		</div>
		<Card.Root>
			<Card.Header class="flex flex-row justify-between px-7">
				<div>
					<Card.Title
						>Sale Details for {new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
							value.toDate(getLocalTimeZone())
						)}</Card.Title
					>
					<Card.Description>
						Current month's oilSales shown. Choose earlier date for previous month's details.
					</Card.Description>
				</div>
				<div>
					<Popover.Root>
						<Popover.Trigger asChild let:builder>
							<Button
								variant="outline"
								class={cn(
									'w-[240px] justify-start text-left font-normal',
									!value && 'text-muted-foreground'
								)}
								builders={[builder]}
							>
								<CalendarIcon class="mr-2 h-4 w-4" />
								{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
							</Button>
						</Popover.Trigger>
						<Popover.Content class="w-auto p-0" align="start">
							<Calendar bind:value />
						</Popover.Content>
					</Popover.Root>
				</div>
			</Card.Header>
			<Card.Content>
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Name</Table.Head>
							<Table.Head class="hidden sm:table-cell">Date</Table.Head>
							<Table.Head class="hidden sm:table-cell">Items Count</Table.Head>
							<Table.Head class="hidden md:table-cell">Total</Table.Head>
							<Table.Head class="text-right">Action</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#if !!$oilSalesList && $oilSalesList.length > 0}
							{#each $oilSalesList as sales}
								<Table.Row class="">
									<Table.Cell>
										<div class="font-medium">{sales.employeeName}</div>
									</Table.Cell>
									<Table.Cell class="hidden sm:table-cell">
										{df.format(sales.salesDate)}
									</Table.Cell>
									<Table.Cell class="hidden sm:table-cell">
										<Badge class="mx-1 text-xs" variant="default">{sales.items.length}</Badge>
									</Table.Cell>
									<Table.Cell class="currency hidden md:table-cell">{sales.actuals}</Table.Cell>

									<Table.Cell class="text-right">
										<Button on:click={() => addComponent(sales)} size="icon" variant="ghost">
											<Edit size={16}></Edit>
										</Button>
										<Button on:click={() => viewoilSales(sales)} size="icon" variant="outline">
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
					db.oilsales.delete(deleteSale.id);
					onDelete = false;
				}}>Continue</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
