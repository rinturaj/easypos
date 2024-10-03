<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { liveQuery } from 'dexie';
	import { df, type Product, type ProductStock } from '../../../database/model';
	import { componentData, componentSide, sheetOpen } from '../../../lib/component.store';
	import AddProducts from '../../../lib/components/custom/AddProducts.svelte';
	import Badge from '../../../lib/components/ui/badge/badge.svelte';
	import { db } from '../../../database/db';
	import { Edit, Trash2 } from 'lucide-svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import StockAddition from './StockAddition.svelte';

	let onDelete = false;
	let onDeleteProduct: ProductStock;
	$: productStocks = liveQuery(async () => {
		return await db.productStock.toArray();
	});

	function view(p: ProductStock) {
		componentData.set(p);
		componentSide.set(StockAddition);
	}
</script>

<div class="grid grid-cols-1 gap-2">
	<Card.Root class="">
		<Card.Header class="pb-3">
			<Card.Title>Your Stock</Card.Title>
			<Card.Description class="max-w-lg text-balance leading-relaxed">
				Introducing Our Dynamic Orders Dashboard for Seamless Management and Insightful Analysis.
			</Card.Description>
		</Card.Header>
		<Card.Footer>
			<Button
				on:click={() => {
					componentSide.set(StockAddition);
					componentData.set(null);
				}}>Create New Stock</Button
			>
		</Card.Footer>
	</Card.Root>

	<Card.Root class="">
		<Card.Header class=" px-7">
			<Card.Title>Orders</Card.Title>
			<Card.Description>Recent orders from your store.</Card.Description>
		</Card.Header>
		<Card.Content>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Product</Table.Head>
						<Table.Head class="hidden sm:table-cell">Purchase On</Table.Head>
						<Table.Head class="">Qty</Table.Head>
						<Table.Head class="">Amount</Table.Head>
						<Table.Head class="text-right">...</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#if !!$productStocks && $productStocks.length > 0}
						{#each $productStocks as p}
							<Table.Row class="bg-accent">
								<Table.Cell>
									<div class="font-medium">{p.name}</div>
									<div class="hidden text-sm text-muted-foreground md:inline">{p.code}</div>
								</Table.Cell>
								<Table.Cell class="hidden sm:table-cell">{df.format(p.purchasedOn)}</Table.Cell>
								<Table.Cell class="">
									<Badge class="text-xs" variant="secondary">{p.quantity}</Badge>
								</Table.Cell>
								<Table.Cell class="">
									<span class="currency text-green-900">{p.purchaseRate}</span>
								</Table.Cell>
								<Table.Cell class="text-right"
									><div class="flex items-center justify-end space-x-2">
										<Button
											on:click={() => {
												view(p);
											}}
											variant="ghost"
										>
											<Edit class="h-4 w-4 text-primary" />
										</Button>

										<Button
											on:click={() => {
												onDeleteProduct = p;
												onDelete = true;
											}}
											variant="ghost"
										>
											<Trash2 class="h-4 w-4 text-red-600" />
										</Button>
									</div></Table.Cell
								>
							</Table.Row>
						{/each}
					{/if}
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>
</div>

<AlertDialog.Root bind:open={onDelete}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete from your system.
				<p class="text-red-500">{onDeleteProduct.name}</p>
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
					db.productStock.delete(onDeleteProduct.id);
					onDelete = false;
				}}>Continue</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
