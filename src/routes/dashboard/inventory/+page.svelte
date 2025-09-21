<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { fade, slide } from 'svelte/transition';

	// Stores for inventory data
	const inventoryItems = writable([]);
	const products = writable([]);

	// Form state
	let newPurchase = {
		date: new Date().toISOString().split('T')[0],
		productId: '',
		productName: '',
		quantity: 1,
		costPerUnit: 0,
		totalCost: 0,
		supplier: '',
		notes: ''
	};

	// UI state
	let isLoading = true;
	let selectedDateFilter = 'all';
	let customDateRange = {
		start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
		end: new Date().toISOString().split('T')[0]
	};

	// Mock data - replace with your actual API calls
	const fetchInventoryItems = async () => {
		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 800));

		return [
			{
				id: 1,
				date: '2024-03-10',
				productId: 1,
				productName: 'Coffee',
				quantity: 50,
				costPerUnit: 2.5,
				totalCost: 125.0,
				supplier: 'Bean Suppliers Inc.',
				notes: 'Regular monthly order'
			},
			{
				id: 2,
				date: '2024-03-10',
				productId: 2,
				productName: 'Sandwich Bread',
				quantity: 30,
				costPerUnit: 1.75,
				totalCost: 52.5,
				supplier: 'Fresh Bakery',
				notes: 'Whole wheat'
			},
			{
				id: 3,
				date: '2024-03-05',
				productId: 3,
				productName: 'Notebooks',
				quantity: 100,
				costPerUnit: 2.0,
				totalCost: 200.0,
				supplier: 'Office Supplies Co.',
				notes: 'Bulk order for new semester'
			},
			{
				id: 4,
				date: '2024-02-28',
				productId: 4,
				productName: 'Headphones',
				quantity: 5,
				costPerUnit: 15.0,
				totalCost: 75.0,
				supplier: 'Tech Distributors',
				notes: 'Budget model for resale'
			},
			{
				id: 5,
				date: '2024-02-25',
				productId: 5,
				productName: 'Water Bottles',
				quantity: 100,
				costPerUnit: 1.0,
				totalCost: 100.0,
				supplier: 'Hydration Wholesale',
				notes: 'Spring water 500ml'
			}
		];
	};

	const fetchProducts = async () => {
		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 500));

		return [
			{ id: 1, name: 'Coffee', price: 3.99, category: 'Beverages', sku: 'BEV001' },
			{ id: 2, name: 'Sandwich Bread', price: 5.99, category: 'Food', sku: 'FOOD001' },
			{ id: 3, name: 'Notebooks', price: 4.5, category: 'Stationery', sku: 'STAT001' },
			{ id: 4, name: 'Headphones', price: 29.99, category: 'Electronics', sku: 'ELEC001' },
			{ id: 5, name: 'Water Bottles', price: 2.5, category: 'Beverages', sku: 'BEV002' },
			{ id: 6, name: 'Salad Containers', price: 7.99, category: 'Food', sku: 'FOOD002' },
			{ id: 7, name: 'USB Cables', price: 9.99, category: 'Electronics', sku: 'ELEC002' },
			{ id: 8, name: 'Protein Bars', price: 2.99, category: 'Food', sku: 'FOOD003' }
		];
	};

	// Load data on mount
	onMount(async () => {
		try {
			const [itemsData, productsData] = await Promise.all([fetchInventoryItems(), fetchProducts()]);

			inventoryItems.set(itemsData);
			products.set(productsData);
		} catch (error) {
			console.error('Failed to fetch data:', error);
			showToast('Failed to load data', 'error');
		} finally {
			isLoading = false;
		}
	});

	// Calculate total cost when quantity or cost per unit changes
	$: newPurchase.totalCost = newPurchase.quantity * newPurchase.costPerUnit;

	// Update product name when product ID changes
	$: {
		if (newPurchase.productId) {
			const selectedProduct = $products.find(
				(p) => p.id.toString() === newPurchase.productId.toString()
			);
			if (selectedProduct) {
				newPurchase.productName = selectedProduct.name;
			}
		}
	}

	// Filter inventory items based on date selection
	$: filteredInventoryItems = filterInventoryByDate(
		$inventoryItems,
		selectedDateFilter,
		customDateRange
	);

	// Group inventory items by date
	$: groupedInventoryItems = groupByDate(filteredInventoryItems);

	function filterInventoryByDate(items, filter, dateRange) {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		const lastWeekStart = new Date(today);
		lastWeekStart.setDate(lastWeekStart.getDate() - 7);

		const lastMonthStart = new Date(today);
		lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);

		switch (filter) {
			case 'today':
				return items.filter((item) => new Date(item.date).toDateString() === today.toDateString());
			case 'yesterday':
				return items.filter(
					(item) => new Date(item.date).toDateString() === yesterday.toDateString()
				);
			case 'last7days':
				return items.filter((item) => {
					const itemDate = new Date(item.date);
					return itemDate >= lastWeekStart && itemDate <= today;
				});
			case 'last30days':
				return items.filter((item) => {
					const itemDate = new Date(item.date);
					return itemDate >= lastMonthStart && itemDate <= today;
				});
			case 'custom':
				if (dateRange.start && dateRange.end) {
					const startDate = new Date(dateRange.start);
					const endDate = new Date(dateRange.end);
					endDate.setHours(23, 59, 59, 999); // Include the entire end day

					return items.filter((item) => {
						const itemDate = new Date(item.date);
						return itemDate >= startDate && itemDate <= endDate;
					});
				}
				return items;
			default:
				return items;
		}
	}

	function groupByDate(items) {
		const grouped = {};

		items.forEach((item) => {
			if (!grouped[item.date]) {
				grouped[item.date] = [];
			}
			grouped[item.date].push(item);
		});

		// Convert to array and sort by date (newest first)
		return Object.entries(grouped)
			.map(([date, items]) => ({ date, items }))
			.sort((a, b) => new Date(b.date) - new Date(a.date));
	}

	// Add new inventory purchase
	function addInventoryPurchase() {
		if (!validatePurchaseForm()) return;

		// Generate a new ID (in a real app, this would come from the backend)
		const newId = Math.max(0, ...$inventoryItems.map((item) => item.id)) + 1;

		const purchaseToAdd = {
			id: newId,
			...newPurchase
		};

		// Add to inventory items
		inventoryItems.update((items) => [purchaseToAdd, ...items]);

		// Reset form
		newPurchase = {
			date: new Date().toISOString().split('T')[0],
			productId: '',
			productName: '',
			quantity: 1,
			costPerUnit: 0,
			totalCost: 0,
			supplier: '',
			notes: ''
		};

		showToast('Inventory purchase added successfully');
	}

	// Validate form before submission
	function validatePurchaseForm() {
		if (!newPurchase.productId) {
			showToast('Please select a product', 'error');
			return false;
		}

		if (!newPurchase.quantity || newPurchase.quantity <= 0) {
			showToast('Please enter a valid quantity', 'error');
			return false;
		}

		if (!newPurchase.costPerUnit || newPurchase.costPerUnit <= 0) {
			showToast('Please enter a valid cost per unit', 'error');
			return false;
		}

		return true;
	}

	// Format date for display
	function formatDate(dateString) {
		const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
		return new Date(dateString).toLocaleDateString(undefined, options);
	}

	// Toast notification
	let toast = { visible: false, message: '', type: 'success' };

	function showToast(message, type = 'success') {
		toast = { visible: true, message, type };
		setTimeout(() => {
			toast = { visible: false, message: '', type: 'success' };
		}, 3000);
	}
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="bg-white shadow-sm">
		<div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
			<h1 class="text-xl font-semibold text-gray-900">Inventory Management</h1>
		</div>
	</header>

	<!-- Main content -->
	<main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
		<!-- Add New Purchase Form -->
		<div class="mb-6 rounded-lg bg-white shadow">
			<div class="px-4 py-5 sm:p-6">
				<h2 class="mb-4 text-lg font-medium text-gray-900">Add New Inventory Purchase</h2>

				<!-- Replace the existing form grid with this: -->
				<div class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
					<!-- Date -->
					<div class="sm:col-span-3 lg:col-span-2">
						<label for="date" class="block text-sm font-medium text-gray-700">Purchase Date</label>
						<div class="mt-1">
							<input
								type="date"
								id="date"
								bind:value={newPurchase.date}
								class="block h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
							/>
						</div>
					</div>

					<!-- Product -->
					<div class="sm:col-span-3 lg:col-span-2">
						<label for="product" class="block text-sm font-medium text-gray-700">Product</label>
						<div class="mt-1">
							<select
								id="product"
								bind:value={newPurchase.productId}
								class="block h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
							>
								<option value="">Select a product</option>
								{#each $products as product}
									<option value={product.id}>{product.name} ({product.sku})</option>
								{/each}
							</select>
						</div>
					</div>

					<!-- Supplier -->
					<div class="sm:col-span-3 lg:col-span-2">
						<label for="supplier" class="block text-sm font-medium text-gray-700">Supplier</label>
						<div class="mt-1">
							<input
								type="text"
								id="supplier"
								bind:value={newPurchase.supplier}
								class="block h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
								placeholder="Supplier name"
							/>
						</div>
					</div>

					<!-- Quantity -->
					<div class="sm:col-span-2 lg:col-span-2">
						<label for="quantity" class="block text-sm font-medium text-gray-700">Quantity</label>
						<div class="mt-1">
							<input
								type="number"
								id="quantity"
								bind:value={newPurchase.quantity}
								min="1"
								class="block h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
							/>
						</div>
					</div>

					<!-- Cost Per Unit -->
					<div class="sm:col-span-2 lg:col-span-2">
						<label for="costPerUnit" class="block text-sm font-medium text-gray-700"
							>Cost Per Unit ($)</label
						>
						<div class="mt-1">
							<input
								type="number"
								id="costPerUnit"
								bind:value={newPurchase.costPerUnit}
								min="0.01"
								step="0.01"
								class="block h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
							/>
						</div>
					</div>

					<!-- Total Cost (calculated) -->
					<div class="sm:col-span-2 lg:col-span-2">
						<label for="totalCost" class="block text-sm font-medium text-gray-700"
							>Total Cost ($)</label
						>
						<div class="mt-1">
							<input
								type="number"
								id="totalCost"
								value={newPurchase.totalCost.toFixed(2)}
								readonly
								class="block h-10 w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
							/>
						</div>
					</div>

					<!-- Notes -->
					<div class="sm:col-span-6">
						<label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
						<div class="mt-1">
							<textarea
								id="notes"
								bind:value={newPurchase.notes}
								rows="2"
								class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
								placeholder="Optional notes about this purchase"
							></textarea>
						</div>
					</div>
				</div>

				<div class="mt-5">
					<button
						type="button"
						on:click={addInventoryPurchase}
						class="inline-flex w-full items-center rounded-md border border-transparent bg-primary px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto"
					>
						Add Purchase
					</button>
				</div>
			</div>
		</div>

		<!-- Purchase History -->
		<div class="rounded-lg bg-white shadow">
			<div class="border-b border-gray-200 px-4 py-5 sm:px-6">
				<!-- Replace the date filter section with a more responsive version: -->
				<div class="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
					<h2 class="mb-3 text-lg font-medium text-gray-900 sm:mb-0">Purchase History</h2>

					<!-- Date Filter -->
					<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
						<div class="flex items-center gap-2">
							<label for="dateFilter" class="whitespace-nowrap text-sm font-medium text-gray-700"
								>Filter by:</label
							>
							<select
								id="dateFilter"
								bind:value={selectedDateFilter}
								class="h-10 flex-grow rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
							>
								<option value="all">All Time</option>
								<option value="today">Today</option>
								<option value="yesterday">Yesterday</option>
								<option value="last7days">Last 7 Days</option>
								<option value="last30days">Last 30 Days</option>
								<option value="custom">Custom Range</option>
							</select>
						</div>

						{#if selectedDateFilter === 'custom'}
							<div class="mt-2 flex flex-col items-start gap-2 sm:mt-0 sm:flex-row sm:items-center">
								<input
									type="date"
									bind:value={customDateRange.start}
									class="h-10 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
								/>
								<span class="hidden text-gray-500 sm:inline">to</span>
								<span class="inline text-gray-500 sm:hidden">to</span>
								<input
									type="date"
									bind:value={customDateRange.end}
									class="h-10 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
								/>
							</div>
						{/if}
					</div>
				</div>
			</div>

			<!-- Loading state -->
			{#if isLoading}
				<div class="flex items-center justify-center py-12">
					<div
						class="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"
					></div>
				</div>
			{:else if groupedInventoryItems.length === 0}
				<div class="py-12 text-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mx-auto h-12 w-12 text-gray-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
						/>
					</svg>
					<h3 class="mt-2 text-sm font-medium text-gray-900">No purchases found</h3>
					<p class="mt-1 text-sm text-gray-500">
						No inventory purchases match your current filter.
					</p>
				</div>
			{:else}
				<!-- Purchases grouped by date -->
				{#each groupedInventoryItems as group}
					<div class="border-b border-gray-200 last:border-b-0" transition:fade={{ duration: 200 }}>
						<div class="bg-gray-50 px-4 py-3">
							<h3 class="text-sm font-medium text-gray-700">{formatDate(group.date)}</h3>
						</div>

						<!-- Replace the table section with this responsive approach -->
						<div class="overflow-hidden">
							<!-- Desktop view: Table -->
							<div class="hidden md:block">
								<table class="min-w-full divide-y divide-gray-200">
									<thead class="bg-gray-50">
										<tr>
											<th
												scope="col"
												class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
												>Product</th
											>
											<th
												scope="col"
												class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
												>Supplier</th
											>
											<th
												scope="col"
												class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
												>Quantity</th
											>
											<th
												scope="col"
												class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
												>Cost Per Unit</th
											>
											<th
												scope="col"
												class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
												>Total Cost</th
											>
										</tr>
									</thead>
									<tbody class="divide-y divide-gray-200 bg-white">
										{#each group.items as item}
											<tr>
												<td class="whitespace-nowrap px-6 py-4">
													<div class="text-sm font-medium text-gray-900">{item.productName}</div>
													{#if item.notes}
														<div class="text-xs text-gray-500">{item.notes}</div>
													{/if}
												</td>
												<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500"
													>{item.supplier}</td
												>
												<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500"
													>{item.quantity}</td
												>
												<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500"
													>${item.costPerUnit.toFixed(2)}</td
												>
												<td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900"
													>${item.totalCost.toFixed(2)}</td
												>
											</tr>
										{/each}

										<!-- Daily total -->
										<tr class="bg-gray-50">
											<td colspan="4" class="px-6 py-3 text-right text-sm font-medium text-gray-700"
												>Daily Total:</td
											>
											<td class="whitespace-nowrap px-6 py-3 text-sm font-medium text-gray-900">
												${group.items.reduce((sum, item) => sum + item.totalCost, 0).toFixed(2)}
											</td>
										</tr>
									</tbody>
								</table>
							</div>

							<!-- Mobile view: Cards -->
							<div class="md:hidden">
								<div class="space-y-4">
									{#each group.items as item}
										<div class="rounded-md border border-gray-100 bg-white p-4 shadow-sm">
											<div class="mb-2 flex items-start justify-between">
												<div class="text-sm font-medium text-gray-900">{item.productName}</div>
												<div class="text-sm font-medium text-gray-900">
													${item.totalCost.toFixed(2)}
												</div>
											</div>

											<div class="grid grid-cols-2 gap-2 text-sm">
												<div>
													<span class="text-gray-500">Supplier:</span>
													<span class="ml-1">{item.supplier}</span>
												</div>
												<div>
													<span class="text-gray-500">Quantity:</span>
													<span class="ml-1">{item.quantity}</span>
												</div>
												<div>
													<span class="text-gray-500">Unit Cost:</span>
													<span class="ml-1">${item.costPerUnit.toFixed(2)}</span>
												</div>
											</div>

											{#if item.notes}
												<div class="mt-2 text-xs text-gray-500">
													<span class="font-medium">Notes:</span>
													{item.notes}
												</div>
											{/if}
										</div>
									{/each}

									<!-- Daily total -->
									<div class="rounded-md border border-gray-200 bg-gray-50 p-4">
										<div class="flex items-center justify-between">
											<span class="font-medium text-gray-700">Daily Total:</span>
											<span class="font-medium text-gray-900">
												${group.items.reduce((sum, item) => sum + item.totalCost, 0).toFixed(2)}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</main>

	<!-- Toast notification -->
	{#if toast.visible}
		<div
			transition:fade
			class="fixed bottom-4 right-4 rounded-md px-4 py-2 shadow-lg {toast.type === 'success'
				? 'bg-green-500 text-white'
				: 'bg-red-500 text-white'}"
		>
			{toast.message}
		</div>
	{/if}
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Open Sans', 'Helvetica Neue', sans-serif;
	}

	/* Tailwind classes */
	:global(:root) {
		--color-primary: #4f46e5;
		--color-primary-hover: #4338ca;
	}

	.bg-primary {
		background-color: var(--color-primary);
	}

	.bg-primary\/90 {
		background-color: rgba(79, 70, 229, 0.9);
	}

	.text-primary {
		color: var(--color-primary);
	}

	.focus\:ring-primary:focus {
		--tw-ring-color: var(--color-primary);
	}

	.focus\:border-primary:focus {
		border-color: var(--color-primary);
	}

	.hover\:bg-primary\/90:hover {
		background-color: var(--color-primary-hover);
	}

	/* Form styling to match shadcn aesthetic */
	input,
	select,
	textarea {
		padding: 0.5rem;
		border-width: 1px;
		border-radius: 0.375rem;
	}

	input:focus,
	select:focus,
	textarea:focus {
		outline: 2px solid transparent;
		outline-offset: 2px;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
	}

	@media (max-width: 640px) {
		input,
		select,
		textarea {
			font-size: 16px; /* Prevents iOS zoom on focus */
		}

		.h-10 {
			height: 2.75rem; /* Slightly larger touch targets on mobile */
		}
	}
</style>
