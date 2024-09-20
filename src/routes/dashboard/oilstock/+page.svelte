<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import {
		CalendarDate,
		DateFormatter,
		getLocalTimeZone,
		type DateValue
	} from '@internationalized/date';
	import type { Oil } from '../../../database/model';
	import { liveQuery } from 'dexie';
	import { db } from '../../../database/db';
	import Button from '../../../lib/components/ui/button/button.svelte';
	import { CalendarIcon, Trash2 } from 'lucide-svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import Calendar from '../../../lib/components/ui/calendar/calendar.svelte';
	import { cn } from '../../../lib/utils';

	let onDelete = false;
	let deleteOil: Oil;

	$: oilList = liveQuery(async () => {
		return await db.oil.where('createdOn').between(startDate, endDate).toArray();
	});

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let value: DateValue = new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, 1);

	$: startDate = value.toDate(getLocalTimeZone());
	$: endDate = new CalendarDate(value.year, value.month + 1, 1).toDate(getLocalTimeZone());
</script>

<div class="flex flex-row items-center justify-between py-3 align-middle">
	<div>
		<div class="">
			Oil Stock Details for {new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
				value.toDate(getLocalTimeZone())
			)}
		</div>
		<p class="text-sm text-muted-foreground">
			Current month's Oil stock shown. Choose earlier date for previous month's details.
		</p>
	</div>

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

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head class="hidden sm:table-cell">Created On</Table.Head>
			<Table.Head class="hidden sm:table-cell">Name</Table.Head>
			<Table.Head class="hidden sm:table-cell">Size</Table.Head>
			<Table.Head>Quanitity</Table.Head>

			<Table.Head class="">Total Amount</Table.Head>
			<Table.Head class="text-right"></Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#if !!$oilList && $oilList.length > 0}
			{#each $oilList as o}
				<Table.Row class="bg-accent">
					<Table.Cell class="font-medium">{df.format(o.createdOn)}</Table.Cell>

					<Table.Cell>
						<div class="font-medium">{o.name}</div>
					</Table.Cell>
					<Table.Cell class="hidden sm:table-cell">{o.size}</Table.Cell>

					<Table.Cell class=" ">{o.quantity}</Table.Cell>
					<Table.Cell class=" ">
						<span class="currency">{o.unitPrice}</span> x {o.quantity} =
						<span class="currency font-bold"> {Number(o.unitPrice * o.quantity).toFixed(2)} </span>
					</Table.Cell>
					<Table.Cell>
						<div class="flex items-center justify-end space-x-2">
							<Button
								on:click={() => {
									deleteOil = o;
									onDelete = true;
								}}
								variant="ghost"
							>
								<Trash2 class="h-4 w-4 text-red-600" />
							</Button>
						</div>
					</Table.Cell>
				</Table.Row>
			{/each}
		{:else}
			<Table.Row>
				<Table.Cell colspan={4} class="mt-4 pt-4 text-center font-medium">
					<div class="flex flex-col items-center">
						<div class="text-2xl font-bold text-gray-700">No Oil Data Available</div>
						<p class="mt-2 text-gray-500">Please add some data to get started.</p>
						<!-- <Button class="mt-3" on:click={() => add()}>Add New Expenses</Button> -->
					</div>
				</Table.Cell>
			</Table.Row>
		{/if}
	</Table.Body>
</Table.Root>

<AlertDialog.Root bind:open={onDelete}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete from your system.
				<p class="text-red-500">{deleteOil.id}</p>
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
					db.oil.delete(deleteOil.id);
					onDelete = false;
				}}>Continue</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
