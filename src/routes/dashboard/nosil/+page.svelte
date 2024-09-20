<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { liveQuery } from 'dexie';
	import { Activity, CreditCard, DollarSign, FileWarning, Trash2, Users } from 'lucide-svelte';
	import { db } from '../../../database/db';
	import Badge from '../../../lib/components/ui/badge/badge.svelte';
	import Button from '../../../lib/components/ui/button/button.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import type { Nosil } from '../../../database/model';
	let onDelete = false;

	let deleteNosil: Nosil;
	$: nosilList = liveQuery(async () => {
		return await db.nosil.toArray();
	});
</script>

<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
	{#if !!$nosilList && $nosilList.length > 0}
		{#each $nosilList as nosil (nosil.id)}
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium text-muted-foreground"
						>Current Reading: {nosil.reading || 0}</Card.Title
					>
					<Button
						on:click={() => {
							deleteNosil = nosil;
							onDelete = true;
						}}
						variant="ghost"
					>
						<Trash2 class="h-4 w-4 text-red-600" />
					</Button>
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">{nosil.name}</div>

					<p class="text-xs uppercase text-muted-foreground">
						<Badge class={nosil.type == 'petrol' ? 'bg-blue-500' : 'bg-green-500'}
							>{nosil.type}</Badge
						>
					</p>
				</Card.Content>
			</Card.Root>
		{/each}
	{:else}
		<div>
			<FileWarning />
			<p class="">Nosile details not updated</p>
		</div>
	{/if}
</div>

<AlertDialog.Root bind:open={onDelete}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete from your system.
				<p class="text-red-500">{deleteNosil.type} : {deleteNosil.name}</p>
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
					db.nosil.delete(deleteNosil.id);
					onDelete = false;
				}}>Continue</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
