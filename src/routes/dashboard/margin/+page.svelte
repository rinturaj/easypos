<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { liveQuery } from 'dexie';
	import type { Product, ProductMargin } from '../../../database/model';
	import { componentData, componentSide, sheetOpen } from '../../../lib/component.store';
	import Badge from '../../../lib/components/ui/badge/badge.svelte';
	import { db } from '../../../database/db';
	import { Edit, Trash2 } from 'lucide-svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import MarginUpdate from '../../../lib/components/custom/MarginUpdate.svelte';
	import { toNumber } from '../../../lib/utils';

	let onDelete = false;
	let onDeleteProduct: ProductMargin;
	$: stockOverview = liveQuery(() => {
		return db.stockOverview.toArray();
	});
	$: productList = liveQuery(async () => {
		return (await db.productMargin.toArray()).map((x) => {
			x.stock = $stockOverview.find((y) => y.id == x.stockOverview);
			return x;
		});
	});

	function view(p: ProductMargin) {
		componentData.set(p);
		componentSide.set(MarginUpdate);
	}
	function calculateProfit(p: ProductMargin) {
		const invested = p.stock?.totalValue || 0;
		const avgPrice = p.stock?.averagePrice || 0;
		if (p.marginType == 'Percent') {
			return toNumber(invested + (p.margin / 100) * (p.stock?.totalValue || 0) - invested);
		} else {
			return toNumber((avgPrice + Number(p.margin)) * (p.stock?.currentQuantity || 0) - invested);
		}
	}
	function calculateSellingPrice(p: ProductMargin) {
		const avgPrice = p.stock?.averagePrice || 0;
		if (p.marginType == 'Percent') {
			return toNumber(avgPrice + (p.margin / 100) * avgPrice);
		} else {
			return toNumber(avgPrice + Number(p.margin));
		}
	}
</script>

<div class="grid grid-cols-1 gap-2">
	<Card.Root class="">
		<Card.Header class="pb-3">
			<Card.Title>Product Margin</Card.Title>
			<Card.Description class="max-w-lg text-balance leading-relaxed">
				This is the section to update the product selling price
			</Card.Description>
		</Card.Header>
		<Card.Footer>
			<Button
				on:click={() => {
					componentSide.set(MarginUpdate);
					componentData.set(null);
				}}>Create New Product</Button
			>
		</Card.Footer>
	</Card.Root>

	<Card.Root class="">
		<Card.Header class=" px-7">
			<Card.Title>Products</Card.Title>
			<Card.Description></Card.Description>
		</Card.Header>
		<Card.Content>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Name</Table.Head>
						<Table.Head class="hidden sm:table-cell">Unit</Table.Head>
						<Table.Head class="hidden md:table-cell">Average Price</Table.Head>
						<Table.Head class="hidden md:table-cell">Invested Amount</Table.Head>
						<Table.Head class="hidden md:table-cell">Margin</Table.Head>
						<Table.Head class="hidden md:table-cell">Expected Profit</Table.Head>
						<Table.Head class="">Selling Price</Table.Head>
						<Table.Head class="text-right">...</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#if !!$productList && $productList.length > 0}
						{#each $productList as p}
							<Table.Row class="bg-accent">
								<Table.Cell>
									<div class="font-medium">{p.stock?.name}</div>
									<div class="hidden text-sm text-muted-foreground md:inline">{p.stock?.code}</div>
								</Table.Cell>
								<Table.Cell class="hidden sm:table-cell">{p.stock?.unit}</Table.Cell>
								<Table.Cell class="currency hidden sm:table-cell"
									>{p.stock?.averagePrice}</Table.Cell
								>
								<Table.Cell class="currency hidden sm:table-cell">{p.stock?.totalValue}</Table.Cell>
								<Table.Cell class="hidden sm:table-cell"
									>{p.marginType == 'Percent' ? p.margin + '%' : '₹' + p.margin}</Table.Cell
								>
								<Table.Cell class="currency hidden sm:table-cell">{calculateProfit(p)}</Table.Cell>
								<Table.Cell class="currency sm:table-cell">{calculateSellingPrice(p)}</Table.Cell>

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
				<p class="text-red-500">{onDeleteProduct.stock?.name}</p>
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
					db.product.delete(onDeleteProduct.id);
					onDelete = false;
				}}>Continue</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
