<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { liveQuery } from 'dexie';
	import { db } from '../../../database/db';
	import Button from '../ui/button/button.svelte';
	import { Calculator } from 'lucide-svelte';
	import { StockOverviewClass, type Product, type StockOverview } from '../../../database/model';
	import { updateStockOverview } from '../../stock';
	import { toast } from 'svelte-sonner';

	$: sv = liveQuery(async () => {
		return await db.stockOverview.toArray();
	});

	$: products = liveQuery(async () => {
		return await db.product.toArray();
	});

	async function stockOverview(p: Product, s: StockOverview[]) {
		console.log(p);

		let stock = await db.productStock
			.where('name')
			.equals(p.name)
			.filter((x) => x.remainingQty > 0)
			.toArray();
		let overview = getStockOverview(p, s);
		if (!overview) {
			overview = new StockOverviewClass({
				name: p.name,
				code: p.code,
				productId: p.id,
				unit: p.unit
			});
		}
		overview = updateStockOverview(overview, stock);
		if (!overview.id) await db.stockOverview.add(overview);
		else await db.stockOverview.update(overview.id, { ...overview });

		toast.info('Stock overview updated');
	}

	function getStockOverview(p: Product, stock: StockOverview[]) {
		let overview = stock.find((x) => x.productId == p.id);
		return overview;
	}
</script>

<Card.Root>
	<Card.Header class="px-7">
		<Card.Title>Stock Overview</Card.Title>
		<Card.Description>Recent stock from your store.</Card.Description>
	</Card.Header>
	<Card.Content>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Product</Table.Head>
					<Table.Head class="hidden sm:table-cell">Unit</Table.Head>
					<Table.Head class=" sm:table-cell">Quantity</Table.Head>
					<Table.Head class=" md:table-cell">Total Price</Table.Head>
					<Table.Head class="">Average Price</Table.Head>
					<Table.Head class="text-right"></Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if !!$products && $products.length > 0}
					{#each $products as p}
						<Table.Row class="bg-accent">
							<Table.Cell>
								<div class="font-medium">{p.name}</div>
								<div class="hidden text-sm text-muted-foreground md:inline">{p.code}</div>
							</Table.Cell>
							<Table.Cell class="hidden sm:table-cell">{p.unit}</Table.Cell>
							<Table.Cell class=" sm:table-cell">
								<Badge class="text-xs" variant="secondary"
									>{getStockOverview(p, $sv)?.currentQuantity || 0}</Badge
								>
							</Table.Cell>
							<Table.Cell class=" currency md:table-cell"
								>{getStockOverview(p, $sv)?.totalValue || 0}</Table.Cell
							>
							<Table.Cell class="currency">{getStockOverview(p, $sv)?.averagePrice || 0}</Table.Cell
							>
							<Table.Cell class="text-right">
								<Button
									on:click={() => {
										stockOverview(p, $sv);
									}}
									variant="outline"
								>
									<Calculator></Calculator>
								</Button>
							</Table.Cell>
						</Table.Row>
					{/each}
				{/if}
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
