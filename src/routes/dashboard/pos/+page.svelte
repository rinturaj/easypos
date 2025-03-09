<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import { Badge } from '$lib/components/ui/badge';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Search, Plus, Minus, ShoppingCart, CreditCard, Trash2 } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	// Sample product data - in a real app, this would come from your backend
	let products = [
		{
			id: 1,
			name: 'Coffee',
			price: 3.5,
			category: 'beverages',
			image: '/placeholder.svg?height=80&width=80'
		},
		{
			id: 2,
			name: 'Sandwich',
			price: 5.99,
			category: 'food',
			image: '/placeholder.svg?height=80&width=80'
		},
		{
			id: 3,
			name: 'Salad',
			price: 4.99,
			category: 'food',
			image: '/placeholder.svg?height=80&width=80'
		},
		{
			id: 4,
			name: 'Soda',
			price: 1.99,
			category: 'beverages',
			image: '/placeholder.svg?height=80&width=80'
		},
		{
			id: 5,
			name: 'Cake',
			price: 3.99,
			category: 'desserts',
			image: '/placeholder.svg?height=80&width=80'
		},
		{
			id: 6,
			name: 'Tea',
			price: 2.5,
			category: 'beverages',
			image: '/placeholder.svg?height=80&width=80'
		},
		{
			id: 5,
			name: 'Cake',
			price: 3.99,
			category: 'desserts',
			image: '/placeholder.svg?height=80&width=80'
		},
		{
			id: 6,
			name: 'Tea',
			price: 2.5,
			category: 'beverages',
			image: '/placeholder.svg?height=80&width=80'
		},
		{
			id: 5,
			name: 'Cake',
			price: 3.99,
			category: 'desserts',
			image: '/placeholder.svg?height=80&width=80'
		},
		{
			id: 6,
			name: 'Tea',
			price: 2.5,
			category: 'beverages',
			image: '/placeholder.svg?height=80&width=80'
		},
		{
			id: 5,
			name: 'Cake',
			price: 3.99,
			category: 'desserts',
			image: '/placeholder.svg?height=80&width=80'
		},
		{
			id: 6,
			name: 'Tea',
			price: 2.5,
			category: 'beverages',
			image: '/placeholder.svg?height=80&width=80'
		},
		{
			id: 5,
			name: 'Cake',
			price: 3.99,
			category: 'desserts',
			image: '/placeholder.svg?height=80&width=80'
		},
		{
			id: 6,
			name: 'Tea',
			price: 2.5,
			category: 'beverages',
			image: '/placeholder.svg?height=80&width=80'
		},
		{
			id: 5,
			name: 'Cake',
			price: 3.99,
			category: 'desserts',
			image: '/placeholder.svg?height=80&width=80'
		},
		{
			id: 6,
			name: 'Tea',
			price: 2.5,
			category: 'beverages',
			image: '/placeholder.svg?height=80&width=80'
		}
	];

	// Cart state
	let cart: any[] = [];
	let searchQuery = '';
	let activeCategory = 'all';
	let showCart = false;

	// Filter products based on search and category
	$: filteredProducts = products.filter((product) => {
		const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
		return matchesSearch && matchesCategory;
	});

	// Calculate total
	$: total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

	// Add to cart
	function addToCart(product: {
		id: any;
		name?: string;
		price?: number;
		category?: string;
		image?: string;
	}) {
		const existingItem = cart.find((item) => item.id === product.id);

		if (existingItem) {
			cart = cart.map((item) =>
				item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
			);
		} else {
			cart = [...cart, { ...product, quantity: 1 }];
		}
	}

	// Update quantity
	function updateQuantity(id: any, change: number) {
		cart = cart
			.map((item) => {
				if (item.id === id) {
					const newQuantity = Math.max(0, item.quantity + change);
					return { ...item, quantity: newQuantity };
				}
				return item;
			})
			.filter((item) => item.quantity > 0);
	}

	// Clear cart
	function clearCart() {
		cart = [];
	}

	// Toggle cart view on mobile
	function toggleCart() {
		showCart = !showCart;
	}

	function goToCheckout() {
		goto('/checkout');
	}

	// Categories
	const categories = [
		{ id: 'all', name: 'All' },
		{ id: 'beverages', name: 'Beverages' },
		{ id: 'food', name: 'Food' },
		{ id: 'desserts', name: 'Desserts' }
	];

</script>

<div>
	<!-- Header -->
	<header class="flex items-center justify-between border-b bg-card p-4">
		<h1 class="text-xl font-bold">POS System</h1>
		<div class="flex items-center gap-2">
			<Badge variant="outline" class="ml-2">{cart.length} items</Badge>
			<Button variant="outline" size="icon" on:click={toggleCart} class="relative">
				<ShoppingCart class="h-5 w-5" />
				{#if cart.length > 0}
					<span
						class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground"
					>
						{cart.length}
					</span>
				{/if}
			</Button>
		</div>
	</header>

	<!-- Main Content -->
	<main class="flex-1 overflow-hidden">
		<!-- Mobile Cart Overlay (shows when cart button is clicked) -->
		{#if showCart}
			<div class="fixed inset-0 z-50 flex flex-col bg-background">
				<div class="flex items-center justify-between border-b p-4">
					<h2 class="text-lg font-semibold">Your Cart</h2>
					<Button variant="ghost" size="icon" on:click={toggleCart}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg
						>
					</Button>
				</div>

				<ScrollArea class="flex-1 p-4">
					{#if cart.length === 0}
						<div class="py-8 text-center text-muted-foreground">Your cart is empty</div>
					{:else}
						<div class="space-y-4">
							{#each cart as item}
								<Card>
									<CardContent class="p-4">
										<div class="flex items-center justify-between">
											<div>
												<p class="font-medium">{item.name}</p>
												<p class="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
											</div>
											<div class="flex items-center gap-2">
												<Button
													variant="outline"
													size="icon"
													on:click={() => updateQuantity(item.id, -1)}
												>
													<Minus class="h-4 w-4" />
												</Button>
												<span class="w-8 text-center">{item.quantity}</span>
												<Button
													variant="outline"
													size="icon"
													on:click={() => updateQuantity(item.id, 1)}
												>
													<Plus class="h-4 w-4" />
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							{/each}
						</div>
					{/if}
				</ScrollArea>

				<div class="border-t p-4">
					<div class="mb-4 flex justify-between">
						<span class="font-semibold">Total:</span>
						<span class="font-semibold">${total.toFixed(2)}</span>
					</div>
					<div class="grid grid-cols-2 gap-2">
						<Button variant="outline" class="w-full" on:click={clearCart}>
							<Trash2 class="mr-2 h-4 w-4" />
							Clear
						</Button>
						<Button class="w-full">
							<CreditCard class="mr-2 h-4 w-4" />
							Checkout
						</Button>
					</div>
				</div>
			</div>
		{/if}

		<!-- Product Search and Categories -->
		<div class="space-y-4 p-4">
			<div class="relative">
				<Search
					class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground"
				/>
				<Input
					type="text"
					placeholder="Search products..."
					bind:value={searchQuery}
					class="pl-10"
				/>
			</div>

			<ScrollArea class="whitespace-nowrap pb-2" orientation="horizontal">
				<div class="flex space-x-2">
					{#each categories as category}
						<Button
							variant={activeCategory === category.id ? 'default' : 'outline'}
							size="sm"
							on:click={() => (activeCategory = category.id)}
						>
							{category.name}
						</Button>
					{/each}
				</div>
			</ScrollArea>
		</div>

		<!-- Products Grid -->
		<ScrollArea class="mb-24 flex-1 px-4 pb-4">
			<div class="grid grid-cols-2 gap-4">
				{#each filteredProducts as product}
					<Card class="overflow-hidden">
						<img
							src={product.image || '/placeholder.svg'}
							alt={product.name}
							class="h-24 w-full object-cover"
						/>
						<CardContent class="p-3">
							<div class="flex items-start justify-between">
								<div>
									<h3 class="text-sm font-medium">{product.name}</h3>
									<p class="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
								</div>
								<Button
									variant="ghost"
									size="icon"
									class="h-8 w-8"
									on:click={() => addToCart(product)}
								>
									<Plus class="h-4 w-4" />
								</Button>
							</div>
						</CardContent>
					</Card>
				{/each}

				{#if filteredProducts.length === 0}
					<div class="col-span-2 py-8 text-center text-muted-foreground">No products found</div>
				{/if}
			</div>
		</ScrollArea>
	</main>

	<!-- Bottom Navigation (when cart is not shown) -->
	<!-- {#if !showCart} -->
	<footer class="fixed bottom-0 left-0 right-0 border-t bg-card p-4">
		<div class="flex items-center justify-between">
			<div>
				<p class="text-sm text-muted-foreground">Total</p>
				<p class="font-semibold">${total.toFixed(2)}</p>
			</div>
			<Button disabled={cart.length === 0} on:click={goToCheckout}>
				<CreditCard class="mr-2 h-4 w-4" />
				Checkout
			</Button>
		</div>
	</footer>
	<!-- {/if} -->
</div>
