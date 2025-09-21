<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { fade, slide } from 'svelte/transition';

	// Product store
	const products = writable<any>([]);

	// UI state
	let isEditModalOpen = false;
	let currentProduct: any = null;
	let searchQuery = '';
	let isLoading = true;

	// Mock data - replace with your actual API call
	const fetchProducts = async () => {
		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 800));

		return [
			{ id: 1, name: 'Coffee', price: 3.99, category: 'Beverages', sku: 'BEV001', stock: 150 },
			{ id: 2, name: 'Sandwich', price: 5.99, category: 'Food', sku: 'FOOD001', stock: 25 },
			{ id: 3, name: 'Notebook', price: 4.5, category: 'Stationery', sku: 'STAT001', stock: 75 },
			{
				id: 4,
				name: 'Headphones',
				price: 29.99,
				category: 'Electronics',
				sku: 'ELEC001',
				stock: 10
			},
			{ id: 5, name: 'Water Bottle', price: 2.5, category: 'Beverages', sku: 'BEV002', stock: 200 },
			{ id: 6, name: 'Salad', price: 7.99, category: 'Food', sku: 'FOOD002', stock: 15 },
			{ id: 7, name: 'USB Cable', price: 9.99, category: 'Electronics', sku: 'ELEC002', stock: 30 },
			{ id: 8, name: 'Protein Bar', price: 2.99, category: 'Food', sku: 'FOOD003', stock: 100 }
		];
	};

	// Load products on mount
	onMount(async () => {
		try {
			const data: any = await fetchProducts();
			products.set(data);
		} catch (error) {
			console.error('Failed to fetch products:', error);
		} finally {
			isLoading = false;
		}
	});

	// Filter products based on search query
	$: filteredProducts = searchQuery
		? $products.filter(
				(product: any) =>
					product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
					product.sku.toLowerCase().includes(searchQuery.toLowerCase())
			)
		: $products;

	// Open edit modal with product data
	function openEditModal(product: any) {
		currentProduct = { ...product };
		isEditModalOpen = true;
	}

	// Close edit modal
	function closeEditModal() {
		isEditModalOpen = false;
		currentProduct = null;
	}

	// Save product changes
	function saveProductChanges() {
		if (!currentProduct) return;

		products.update((items: any) => {
			return items.map((item: any) => (item.id === currentProduct.id ? currentProduct : item));
		});

		// Show success message
		showToast('Product updated successfully');
		closeEditModal();
	}

	// Toast notification
	let toast = { visible: false, message: '' };

	function showToast(message: any) {
		toast = { visible: true, message };
		setTimeout(() => {
			toast = { visible: false, message: '' };
		}, 3000);
	}
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="bg-white shadow-sm">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
			<h1 class="text-xl font-semibold text-gray-900">Products</h1>
			<button
				class="rounded-md bg-primary px-4 py-2 text-white shadow-sm transition-colors hover:bg-primary/90"
				on:click={() =>
					openEditModal({ id: 0, name: '', price: 0, category: '', sku: '', stock: 0 })}
			>
				Add Product
			</button>
		</div>
	</header>

	<!-- Main content -->
	<main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
		<!-- Search bar -->
		<div class="mb-6">
			<div class="relative rounded-md shadow-sm">
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search products by name, category, or SKU..."
					class="block w-full rounded-md border border-gray-300 py-3 pl-4 pr-10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
				/>
				<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 text-gray-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</div>
			</div>
		</div>

		<!-- Loading state -->
		{#if isLoading}
			<div class="flex items-center justify-center py-12">
				<div class="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
			</div>
		{:else}
			<!-- Product list -->
			{#if filteredProducts.length > 0}
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each filteredProducts as product (product.id)}
						<div
							transition:fade={{ duration: 200 }}
							class="overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-md"
						>
							<div class="p-5">
								<div class="flex items-start justify-between">
									<div>
										<h3 class="text-lg font-medium text-gray-900">{product.name}</h3>
										<p class="text-sm text-gray-500">{product.category}</p>
									</div>
									<span
										class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
									>
										${product.price.toFixed(2)}
									</span>
								</div>

								<div class="mt-4 flex items-center justify-between">
									<div>
										<p class="text-sm text-gray-500">SKU: {product.sku}</p>
										<p class="text-sm font-medium text-gray-900">Stock: {product.stock}</p>
									</div>
									<button
										on:click={() => openEditModal(product)}
										class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="mr-1 h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
											/>
										</svg>
										Edit
									</button>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{:else}
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
							d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<h3 class="mt-2 text-sm font-medium text-gray-900">No products found</h3>
					<p class="mt-1 text-sm text-gray-500">
						{searchQuery
							? 'Try a different search term or clear the search.'
							: 'Start by adding some products.'}
					</p>
				</div>
			{/if}
		{/if}
	</main>

	<!-- Edit Modal -->
	{#if isEditModalOpen}
		<div class="fixed inset-0 z-50 overflow-y-auto" transition:fade={{ duration: 200 }}>
			<div
				class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0"
			>
				<!-- Background overlay -->
				<div
					class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
					on:click={closeEditModal}
				></div>

				<!-- Modal panel -->
				<div
					class="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
					transition:slide={{ duration: 300 }}
				>
					<div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
						<div class="sm:flex sm:items-start">
							<div class="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
								<h3 class="text-lg font-medium leading-6 text-gray-900">
									{currentProduct?.id ? 'Edit Product' : 'Add New Product'}
								</h3>

								<div class="mt-4 space-y-4">
									<!-- Product Name -->
									<div>
										<label for="name" class="block text-sm font-medium text-gray-700"
											>Product Name</label
										>
										<input
											type="text"
											id="name"
											bind:value={currentProduct.name}
											class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
										/>
									</div>

									<!-- Price and SKU -->
									<div class="grid grid-cols-2 gap-4">
										<div>
											<label for="price" class="block text-sm font-medium text-gray-700"
												>Price ($)</label
											>
											<input
												type="number"
												id="price"
												bind:value={currentProduct.price}
												min="0"
												step="0.01"
												class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
											/>
										</div>
										<div>
											<label for="sku" class="block text-sm font-medium text-gray-700">SKU</label>
											<input
												type="text"
												id="sku"
												bind:value={currentProduct.sku}
												class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
											/>
										</div>
									</div>

									<!-- Category and Stock -->
									<div class="grid grid-cols-2 gap-4">
										<div>
											<label for="category" class="block text-sm font-medium text-gray-700"
												>Category</label
											>
											<input
												type="text"
												id="category"
												bind:value={currentProduct.category}
												class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
											/>
										</div>
										<div>
											<label for="stock" class="block text-sm font-medium text-gray-700"
												>Stock</label
											>
											<input
												type="number"
												id="stock"
												bind:value={currentProduct.stock}
												min="0"
												class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
						<button
							type="button"
							on:click={saveProductChanges}
							class="inline-flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
						>
							Save
						</button>
						<button
							type="button"
							on:click={closeEditModal}
							class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Toast notification -->
	{#if toast.visible}
		<div
			transition:fade
			class="fixed bottom-4 right-4 rounded-md bg-green-500 px-4 py-2 text-white shadow-lg"
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
</style>
