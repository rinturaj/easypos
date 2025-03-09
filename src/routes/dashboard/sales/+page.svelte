<script lang="ts">
	// Import shadcn components
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import {
		Select,
		SelectTrigger,
		SelectValue,
		SelectContent,
		SelectItem
	} from '$lib/components/ui/select';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
	import { Separator } from '$lib/components/ui/separator';
	import { Search, Plus, ChevronLeft, ChevronRight, Eye, Printer } from 'lucide-svelte';

	// Mock data for demonstration purposes
	let orders = [
		{
			id: 'ORD-001',
			customer: 'John Doe',
			date: '2025-03-09T14:30:00',
			total: 42.99,
			status: 'completed',
			items: 3
		},
		{
			id: 'ORD-002',
			customer: 'Jane Smith',
			date: '2025-03-09T13:15:00',
			total: 27.5,
			status: 'pending',
			items: 2
		},
		{
			id: 'ORD-003',
			customer: 'Robert Johnson',
			date: '2025-03-09T11:45:00',
			total: 68.75,
			status: 'completed',
			items: 5
		},
		{
			id: 'ORD-004',
			customer: 'Emily Davis',
			date: '2025-03-09T10:20:00',
			total: 15.99,
			status: 'cancelled',
			items: 1
		},
		{
			id: 'ORD-005',
			customer: 'Michael Brown',
			date: '2025-03-08T16:50:00',
			total: 94.3,
			status: 'completed',
			items: 7
		},
		{
			id: 'ORD-006',
			customer: 'Lisa Wilson',
			date: '2025-03-08T15:10:00',
			total: 32.45,
			status: 'pending',
			items: 3
		},
		{
			id: 'ORD-007',
			customer: 'David Taylor',
			date: '2025-03-08T09:05:00',
			total: 56.2,
			status: 'completed',
			items: 4
		},
		{
			id: 'ORD-008',
			customer: 'Sarah Miller',
			date: '2025-03-07T17:30:00',
			total: 21.99,
			status: 'completed',
			items: 2
		}
	];

	// Filter states
	let searchTerm = '';
	let statusFilter = 'all';
	let dateFilter = 'all';
	let sortOrder = 'newest';

	// Derived state for filtered orders
	$: filteredOrders = orders
		.filter((order) => {
			// Search filter
			if (searchTerm && !order.id.toLowerCase().includes(searchTerm.toLowerCase())) {
				return false;
			}

			// Status filter
			if (statusFilter !== 'all' && order.status !== statusFilter) {
				return false;
			}

			// Date filter
			const orderDate = new Date(order.date);
			const today = new Date();
			const yesterday = new Date(today);
			yesterday.setDate(yesterday.getDate() - 1);

			if (dateFilter === 'today' && orderDate.toDateString() !== today.toDateString()) {
				return false;
			} else if (
				dateFilter === 'yesterday' &&
				orderDate.toDateString() !== yesterday.toDateString()
			) {
				return false;
			} else if (dateFilter === 'thisWeek') {
				const weekStart = new Date(today);
				weekStart.setDate(today.getDate() - today.getDay());
				if (orderDate < weekStart) {
					return false;
				}
			}

			return true;
		})
		.sort((a, b) => {
			const dateA = new Date(a.date);
			const dateB = new Date(b.date);
			return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
		});

	// Format currency
	function formatCurrency(amount) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(amount);
	}

	// Format date
	function formatDate(dateString) {
		const date = new Date(dateString);
		return date.toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			hour12: true
		});
	}

	// Pagination
	let currentPage = 1;
	let itemsPerPage = 4; // Reduced for mobile view
	$: totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
	$: paginatedOrders = filteredOrders.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	function goToPage(page) {
		currentPage = page;
	}

	// Toggle order details on mobile view
	let expandedOrders = new Set();

	function toggleOrderDetails(orderId) {
		if (expandedOrders.has(orderId)) {
			expandedOrders.delete(orderId);
		} else {
			expandedOrders.add(orderId);
		}
		expandedOrders = expandedOrders; // Trigger reactivity
	}
</script>

<div class="container mx-auto max-w-md px-4 py-4">
	<Card class="w-full">
		<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
			<CardTitle class="text-xl font-bold">Recent Orders</CardTitle>
			<Button variant="default" size="sm" class="h-8 gap-1">
				<Plus class="h-4 w-4" />
				<span class="hidden sm:inline">New Order</span>
			</Button>
		</CardHeader>

		<CardContent class="px-2 pt-4">
			<!-- Search Bar -->
			<div class="relative mb-4">
				<Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
				<Input
					type="text"
					placeholder="Search by Order ID"
					bind:value={searchTerm}
					class="w-full pl-8"
				/>
			</div>

			<!-- Filter Controls - Grid for mobile -->
			<div class="mb-4 grid grid-cols-2 gap-2">
				<div>
					<Select bind:value={statusFilter}>
						<SelectTrigger class="w-full">
							<SelectValue placeholder="Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Statuses</SelectItem>
							<SelectItem value="completed">Completed</SelectItem>
							<SelectItem value="pending">Pending</SelectItem>
							<SelectItem value="cancelled">Cancelled</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div>
					<Select bind:value={dateFilter}>
						<SelectTrigger class="w-full">
							<SelectValue placeholder="Date" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Dates</SelectItem>
							<SelectItem value="today">Today</SelectItem>
							<SelectItem value="yesterday">Yesterday</SelectItem>
							<SelectItem value="thisWeek">This Week</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div class="col-span-2">
					<Select bind:value={sortOrder}>
						<SelectTrigger class="w-full">
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="newest">Newest First</SelectItem>
							<SelectItem value="oldest">Oldest First</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<!-- Order Cards for Mobile -->
			<div class="space-y-3">
				{#if filteredOrders.length === 0}
					<div class="py-6 text-center text-muted-foreground">
						No orders found matching your filters.
					</div>
				{:else}
					{#each paginatedOrders as order}
						<Card class="w-full overflow-hidden">
							<div
								class="flex cursor-pointer items-center justify-between p-3"
								on:click={() => toggleOrderDetails(order.id)}
							>
								<div>
									<div class="font-medium">{order.id}</div>
									<div class="text-sm text-muted-foreground">{formatDate(order.date)}</div>
								</div>
								<div class="flex flex-col items-end">
									<div class="font-medium">{formatCurrency(order.total)}</div>
									<Badge
										variant={order.status === 'completed'
											? 'success'
											: order.status === 'pending'
												? 'warning'
												: 'destructive'}
									>
										{order.status}
									</Badge>
								</div>
							</div>

							{#if expandedOrders.has(order.id)}
								<Separator />
								<div class="bg-muted/30 p-3">
									<div class="grid grid-cols-2 gap-2 text-sm">
										<div class="text-muted-foreground">Customer:</div>
										<div class="font-medium">{order.customer}</div>

										<div class="text-muted-foreground">Items:</div>
										<div class="font-medium">{order.items}</div>

										<div class="text-muted-foreground">Date:</div>
										<div class="font-medium">{formatDate(order.date)}</div>

										<div class="text-muted-foreground">Total:</div>
										<div class="font-medium">{formatCurrency(order.total)}</div>
									</div>

									<div class="mt-3 flex justify-end gap-2">
										<Button variant="outline" size="sm" class="h-8 gap-1">
											<Eye class="h-4 w-4" />
											<span>View</span>
										</Button>
										<Button variant="outline" size="sm" class="h-8 gap-1">
											<Printer class="h-4 w-4" />
											<span>Print</span>
										</Button>
									</div>
								</div>
							{/if}
						</Card>
					{/each}
				{/if}
			</div>

			<!-- Pagination for Mobile -->
			{#if totalPages > 1}
				<div class="mt-4 flex items-center justify-between">
					<Button
						variant="outline"
						size="sm"
						on:click={() => goToPage(Math.max(1, currentPage - 1))}
						disabled={currentPage === 1}
					>
						<ChevronLeft class="h-4 w-4" />
					</Button>

					<div class="text-sm">
						Page {currentPage} of {totalPages}
					</div>

					<Button
						variant="outline"
						size="sm"
						on:click={() => goToPage(Math.min(totalPages, currentPage + 1))}
						disabled={currentPage === totalPages}
					>
						<ChevronRight class="h-4 w-4" />
					</Button>
				</div>
			{/if}

			<!-- Summary text -->
			<div class="mt-2 text-center text-xs text-muted-foreground">
				Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(
					currentPage * itemsPerPage,
					filteredOrders.length
				)} of {filteredOrders.length} orders
			</div>
		</CardContent>
	</Card>
</div>
