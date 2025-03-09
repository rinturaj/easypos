<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs/index.js';

	import { RadioGroup, RadioGroupItem } from '$lib/components/ui/radio-group';
	import { Separator } from '$lib/components/ui/separator';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
		SelectValue
	} from '$lib/components/ui/select';
	import { Switch } from '$lib/components/ui/switch';
	import { ArrowLeft, CreditCard, Banknote, Receipt, Percent, User, Check } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	// Mock cart data - in a real app, this would come from a store or passed as a prop
	let cart = [
		{
			id: 1,
			name: 'Coffee',
			price: 3.5,
			quantity: 2,
			image: '/placeholder.svg?height=80&width=80'
		},
		{
			id: 2,
			name: 'Sandwich',
			price: 5.99,
			quantity: 1,
			image: '/placeholder.svg?height=80&width=80'
		},
		{ id: 3, name: 'Salad', price: 4.99, quantity: 1, image: '/placeholder.svg?height=80&width=80' }
	];

	// Checkout state
	let paymentMethod = 'card';
	let discountType = 'percentage';
	let discountValue = 0;
	let taxRate = 8.25; // Default tax rate (%)
	let customerInfo = {
		name: '',
		email: '',
		phone: ''
	};
	let addCustomer = false;
	let cashAmount = 0;
	let receiptOption = 'email';
	let processingPayment = false;
	let paymentComplete = false;

	// Calculate subtotal
	$: subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

	// Calculate discount amount
	$: discountAmount =
		discountType === 'percentage'
			? subtotal * (discountValue / 100)
			: Math.min(discountValue, subtotal);

	// Calculate tax
	$: taxableAmount = subtotal - discountAmount;
	$: taxAmount = taxableAmount * (taxRate / 100);

	// Calculate total
	$: total = taxableAmount + taxAmount;

	// Calculate change if paying with cash
	$: change = Math.max(0, cashAmount - total);

	// Process payment
	async function processPayment() {
		processingPayment = true;

		// Simulate payment processing
		await new Promise((resolve) => setTimeout(resolve, 2000));

		paymentComplete = true;
		processingPayment = false;
	}

	// Return to POS
	function returnToPOS() {
		goto('/pos');
	}

	// Complete transaction and return to POS
	function completeTransaction() {
		// In a real app, you would save the transaction to your database
		// and potentially print a receipt
		returnToPOS();
	}

	onMount(() => {
		// Any initialization code here
	});
</script>

<!-- <div class="flex h-[100dvh] flex-col bg-background"> -->
<!-- Header -->
<header class="flex items-center justify-between border-b bg-card p-4">
	<div class="flex items-center gap-2">
		<Button variant="ghost" size="icon" on:click={returnToPOS}>
			<ArrowLeft class="h-5 w-5" />
		</Button>
		<h1 class="text-xl font-bold">Checkout</h1>
	</div>
	{#if !paymentComplete}
		<div class="text-sm font-medium text-muted-foreground">
			{cart.length}
			{cart.length === 1 ? 'item' : 'items'}
		</div>
	{/if}
</header>

<!-- Main Content -->
<main class="flex-1 overflow-hidden">
	{#if paymentComplete}
		<!-- Payment Success Screen -->
		<div class="flex h-full flex-col items-center justify-center p-6 text-center">
			<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
				<Check class="h-8 w-8 text-primary" />
			</div>
			<h2 class="mb-2 text-2xl font-bold">Payment Successful!</h2>
			<p class="mb-8 text-muted-foreground">Transaction has been completed</p>

			<div class="mb-8 w-full max-w-md rounded-lg bg-muted/30 p-4">
				<div class="mb-2 flex justify-between">
					<span>Total Amount:</span>
					<span class="font-bold">${total.toFixed(2)}</span>
				</div>
				<div class="mb-2 flex justify-between">
					<span>Payment Method:</span>
					<span class="capitalize">{paymentMethod}</span>
				</div>
				{#if paymentMethod === 'cash'}
					<div class="mb-2 flex justify-between">
						<span>Change:</span>
						<span>${change.toFixed(2)}</span>
					</div>
				{/if}
				{#if addCustomer && customerInfo.email}
					<div class="flex justify-between">
						<span>Receipt sent to:</span>
						<span class="text-sm">{customerInfo.email}</span>
					</div>
				{/if}
			</div>

			<Button on:click={completeTransaction}>Return to POS</Button>
		</div>
	{:else}
		<div class="grid h-full md:grid-cols-2">
			<!-- Order Summary (Left Side) -->
			<div class="border-r">
				<ScrollArea class="h-full">
					<div class="space-y-4 p-4">
						<CardTitle class="text-lg">Order Summary</CardTitle>

						<!-- Cart Items -->
						<div class="space-y-3">
							{#each cart as item}
								<div class="flex items-center gap-3 py-2">
									<img
										src={item.image || '/placeholder.svg'}
										alt={item.name}
										class="h-12 w-12 rounded-md object-cover"
									/>
									<div class="flex-1">
										<p class="font-medium">{item.name}</p>
										<p class="text-sm text-muted-foreground">
											${item.price.toFixed(2)} × {item.quantity}
										</p>
									</div>
									<p class="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
								</div>
								<Separator />
							{/each}
						</div>

						<!-- Price Breakdown -->
						<div class="space-y-2 pt-2">
							<div class="flex justify-between">
								<span class="text-muted-foreground">Subtotal</span>
								<span>${subtotal.toFixed(2)}</span>
							</div>

							<!-- Discount Section -->
							<div class="space-y-3 rounded-lg bg-muted/30 p-3">
								<div class="flex items-center justify-between">
									<div class="flex items-center gap-2">
										<Percent class="h-4 w-4 text-muted-foreground" />
										<span>Discount</span>
									</div>
									<span>-${discountAmount.toFixed(2)}</span>
								</div>

								<div class="grid grid-cols-2 gap-2">
									<Select bind:value={discountType}>
										<SelectTrigger>
											<SelectValue placeholder="Type" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="percentage">Percentage (%)</SelectItem>
											<SelectItem value="fixed">Fixed Amount ($)</SelectItem>
										</SelectContent>
									</Select>

									<Input
										type="number"
										bind:value={discountValue}
										min="0"
										max={discountType === 'percentage' ? 100 : subtotal}
										placeholder={discountType === 'percentage' ? '%' : '$'}
									/>
								</div>
							</div>

							<div class="flex justify-between">
								<span class="text-muted-foreground">Tax ({taxRate}%)</span>
								<span>${taxAmount.toFixed(2)}</span>
							</div>

							<Separator />

							<div class="flex justify-between pt-1 text-lg font-bold">
								<span>Total</span>
								<span>${total.toFixed(2)}</span>
							</div>
						</div>

						<!-- Customer Information (Optional) -->
						<div class="pt-2">
							<div class="mb-3 flex items-center justify-between">
								<div class="flex items-center gap-2">
									<User class="h-4 w-4 text-muted-foreground" />
									<span>Customer Information</span>
								</div>
								<div class="flex items-center gap-2">
									<Switch bind:checked={addCustomer} id="add-customer" />
									<Label for="add-customer" class="text-sm">Add Customer</Label>
								</div>
							</div>

							{#if addCustomer}
								<div class="space-y-3">
									<div class="grid gap-2">
										<Label for="customer-name">Name</Label>
										<Input
											id="customer-name"
											bind:value={customerInfo.name}
											placeholder="Customer name"
										/>
									</div>
									<div class="grid gap-2">
										<Label for="customer-email">Email</Label>
										<Input
											id="customer-email"
											type="email"
											bind:value={customerInfo.email}
											placeholder="Email for receipt"
										/>
									</div>
									<div class="grid gap-2">
										<Label for="customer-phone">Phone</Label>
										<Input
											id="customer-phone"
											type="tel"
											bind:value={customerInfo.phone}
											placeholder="Phone number"
										/>
									</div>
								</div>
							{/if}
						</div>
					</div>
				</ScrollArea>
			</div>

			<!-- Payment Methods (Right Side) -->
			<div class="flex h-full flex-col">
				<Tabs.Root value="card" class="flex flex-1 flex-col">
					<Tabs.List class="grid w-full grid-cols-2">
						<Tabs.Trigger value="card" class="flex items-center gap-2">
							<CreditCard class="h-4 w-4" />
							<span>Card</span>
						</Tabs.Trigger>
						<Tabs.Trigger value="cash" class="flex items-center gap-2">
							<Banknote class="h-4 w-4" />
							<span>Cash</span>
						</Tabs.Trigger>
					</Tabs.List>

					<Tabs.Content value="card">
						<div class="flex-1">
							<Card>
								<CardHeader>
									<CardTitle class="text-lg">Card Payment</CardTitle>
								</CardHeader>
								<CardContent>
									<div class="space-y-4">
										<p class="text-muted-foreground">
											Connect card reader or manually enter card details to process payment.
										</p>

										<div class="rounded-lg bg-muted/30 p-4 text-center">
											<CreditCard class="mx-auto mb-2 h-12 w-12 text-muted-foreground" />
											<p>Ready to process card payment</p>
											<p class="mt-1 text-sm text-muted-foreground">
												Amount: ${total.toFixed(2)}
											</p>
										</div>

										<!-- Receipt Options -->
										<div class="pt-2">
											<Label class="mb-2 block">Receipt Options</Label>
											<RadioGroup bind:value={receiptOption} class="flex flex-col space-y-2">
												<div class="flex items-center space-x-2">
													<RadioGroupItem value="none" id="r1" />
													<Label for="r1">No Receipt</Label>
												</div>
												<div class="flex items-center space-x-2">
													<RadioGroupItem value="print" id="r2" />
													<Label for="r2">Print Receipt</Label>
												</div>
												<div class="flex items-center space-x-2">
													<RadioGroupItem value="email" id="r3" />
													<Label for="r3">Email Receipt</Label>
												</div>
											</RadioGroup>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</Tabs.Content>
					<Tabs.Content value="cash">
						<div class="flex-1">
							<Card>
								<CardHeader>
									<CardTitle class="text-lg">Cash Payment</CardTitle>
								</CardHeader>
								<CardContent>
									<div class="space-y-4">
										<div class="grid gap-2">
											<Label for="cash-amount">Cash Received</Label>
											<Input
												id="cash-amount"
												type="number"
												bind:value={cashAmount}
												min={total}
												placeholder="Enter amount"
											/>
										</div>

										<div class="rounded-lg bg-muted/30 p-4">
											<div class="mb-2 flex justify-between">
												<span>Total Due:</span>
												<span class="font-bold">${total.toFixed(2)}</span>
											</div>
											<div class="mb-2 flex justify-between">
												<span>Cash Received:</span>
												<span>${cashAmount.toFixed(2)}</span>
											</div>
											<Separator class="my-2" />
											<div class="flex justify-between font-bold">
												<span>Change Due:</span>
												<span>${change.toFixed(2)}</span>
											</div>
										</div>

										<!-- Quick Cash Buttons -->
										<div class="grid grid-cols-3 gap-2">
											<Button
												variant="outline"
												on:click={() => (cashAmount = Math.ceil(total / 5) * 5)}
											>
												Exact
											</Button>
											<Button
												variant="outline"
												on:click={() => (cashAmount = Math.ceil(total / 5) * 5)}
											>
												${Math.ceil(total / 5) * 5}
											</Button>
											<Button
												variant="outline"
												on:click={() => (cashAmount = Math.ceil(total / 10) * 10)}
											>
												${Math.ceil(total / 10) * 10}
											</Button>
											<Button
												variant="outline"
												on:click={() => (cashAmount = Math.ceil(total / 20) * 20)}
											>
												${Math.ceil(total / 20) * 20}
											</Button>
											<Button variant="outline" on:click={() => (cashAmount = 50)}>$50</Button>
											<Button variant="outline" on:click={() => (cashAmount = 100)}>$100</Button>
										</div>

										<!-- Receipt Options -->
										<div class="pt-2">
											<Label class="mb-2 block">Receipt Options</Label>
											<RadioGroup bind:value={receiptOption} class="flex flex-col space-y-2">
												<div class="flex items-center space-x-2">
													<RadioGroupItem value="none" id="r4" />
													<Label for="r4">No Receipt</Label>
												</div>
												<div class="flex items-center space-x-2">
													<RadioGroupItem value="print" id="r5" />
													<Label for="r5">Print Receipt</Label>
												</div>
												<div class="flex items-center space-x-2">
													<RadioGroupItem value="email" id="r6" />
													<Label for="r6">Email Receipt</Label>
												</div>
											</RadioGroup>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</Tabs.Content>
				</Tabs.Root>

				<!-- Payment Action Button -->
				<div class="border-t p-4">
					<Button
						class="h-12 w-full text-lg"
						on:click={processPayment}
						disabled={processingPayment || (paymentMethod === 'cash' && cashAmount < total)}
					>
						{#if processingPayment}
							Processing...
						{:else if paymentMethod === 'card'}
							Pay ${total.toFixed(2)}
						{:else}
							Complete Cash Payment
						{/if}
					</Button>
				</div>
			</div>
		</div>
	{/if}
</main>
<!-- </div> -->
