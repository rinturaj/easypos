<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import { liveQuery } from 'dexie';
	import type { Staff } from '../../../database/model';
	import Adduser from '../../../lib/components/custom/adduser.svelte';
	import type { PageData } from './$types';
	import { db } from '../../../database/db';
	import Badge from '../../../lib/components/ui/badge/badge.svelte';
	import Button from '../../../lib/components/ui/button/button.svelte';
	import { Trash2 } from 'lucide-svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';

	let onDelete = false;
	let deleteStaff: Staff;
	$: staffList = liveQuery(async () => {
		return await db.staff.toArray();
	});
	async function updateStaffStatus(staff: Staff) {
		await db.staff.update(staff.id, { status: staff.status });
	}
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-[100px]">Name</Table.Head>
			<Table.Head>Joined</Table.Head>
			<Table.Head>Status</Table.Head>
			<Table.Head>Hourly Charge</Table.Head>
			<Table.Head class="text-right"></Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#if !!$staffList && $staffList.length > 0}
			{#each $staffList as staff}
				<Table.Row>
					<Table.Cell class="font-medium">{staff.name}</Table.Cell>
					<Table.Cell>{staff.createdOn}</Table.Cell>
					<Table.Cell>
						<Badge variant={staff.status ? 'default' : 'destructive'}
							>{staff.status ? 'Active' : 'Inactive'}</Badge
						>
					</Table.Cell>
					<Table.Cell class="currency">{staff.hourlyPrice}</Table.Cell>
					<Table.Cell>
						<div class="flex items-center justify-end space-x-2">
							<Switch
								on:click={() => updateStaffStatus({ ...staff, status: !staff.status })}
								checked={staff.status}
								id="airplane-mode"
							/>

							<Button
								on:click={() => {
									deleteStaff = staff;
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
				<Table.Cell colspan={5} class="mt-4 pt-4 text-center font-medium"
					>Staff Details not Available Please add</Table.Cell
				>
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
				<p class="text-red-500">{deleteStaff.name}</p>
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
					db.staff.delete(deleteStaff.id);
					onDelete = false;
				}}>Continue</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
