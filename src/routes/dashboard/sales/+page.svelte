<script lang="ts">
	import { onMount } from 'svelte';
	import {
		ArrowDown,
		ArrowUp,
		Calendar,
		ChevronDown,
		Filter,
		Menu,
		Plus,
		ShoppingBag
	} from 'lucide-svelte';
	import Chart from 'chart.js/auto';

	// Sample data - in a real app, this would come from your backend
	let totalSales = 12580.45;
	let totalOrders = 156;
	let averageOrderValue = totalSales / totalOrders;
	let salesGrowth = 12.5; // percentage

	let recentTransactions = [
		{
			id: 'INV-001',
			customer: 'John Doe',
			amount: 125.5,
			date: '2023-03-14 10:30 AM',
			status: 'completed'
		},
		{
			id: 'INV-002',
			customer: 'Jane Smith',
			amount: 78.25,
			date: '2023-03-14 09:15 AM',
			status: 'completed'
		},
		{
			id: 'INV-003',
			customer: 'Robert Johnson',
			amount: 245.0,
			date: '2023-03-13 04:45 PM',
			status: 'completed'
		},
		{
			id: 'INV-004',
			customer: 'Emily Davis',
			amount: 36.75,
			date: '2023-03-13 02:30 PM',
			status: 'completed'
		},
		{
			id: 'INV-005',
			customer: 'Michael Brown',
			amount: 189.99,
			date: '2023-03-13 11:20 AM',
			status: 'completed'
		}
	];

	let timeFilter = 'This Week';
	let salesChartCanvas: HTMLCanvasElement;
	let salesChart: Chart;

	onMount(() => {
		// Initialize sales chart
		const ctx = salesChartCanvas.getContext('2d');

		if (ctx) {
			salesChart = new Chart(ctx, {
				type: 'line',
				data: {
					labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
					datasets: [
						{
							label: 'Sales',
							data: [1800, 2200, 1900, 2800, 2100, 2500, 1800],
							borderColor: 'rgb(99, 102, 241)',
							backgroundColor: 'rgba(99, 102, 241, 0.1)',
							tension: 0.4,
							fill: true
						}
					]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: {
							display: false
						}
					},
					scales: {
						x: {
							grid: {
								display: false
							}
						},
						y: {
							beginAtZero: true,
							grid: {
								color: 'rgba(0, 0, 0, 0.05)'
							}
						}
					}
				}
			});
		}

		return () => {
			if (salesChart) {
				salesChart.destroy();
			}
		};
	});

	function formatCurrency(value: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(value);
	}
</script>

<div class="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
	<!-- Header -->
	<header class="sticky top-0 z-10 bg-white shadow-sm dark:bg-gray-800">
		<div class="flex items-center justify-between p-4">
			<div class="flex items-center gap-2">
				<button class="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
					<Menu size={24} class="text-gray-700 dark:text-gray-300" />
				</button>
				<h1 class="text-xl font-bold text-gray-900 dark:text-white">Sales Overview</h1>
			</div>
			<div class="flex items-center gap-2">
				<button class="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
					<Filter size={20} class="text-gray-700 dark:text-gray-300" />
				</button>
				<button class="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
					<Calendar size={20} class="text-gray-700 dark:text-gray-300" />
				</button>
			</div>
		</div>

		<!-- Time filter -->
		<div class="px-4 pb-3">
			<button
				class="flex items-center text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300"
			>
				{timeFilter}
				<ChevronDown size={16} class="ml-1" />
			</button>
		</div>
	</header>

	<!-- Main content -->
	<main class="flex-1 space-y-6 overflow-y-auto p-4">
		<!-- Stats cards -->
		<div class="grid grid-cols-2 gap-4">
			<div class="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
				<div class="flex flex-col">
					<span class="text-sm text-gray-500 dark:text-gray-400">Total Sales</span>
					<span class="text-2xl font-bold text-gray-900 dark:text-white"
						>{formatCurrency(totalSales)}</span
					>
					<div class="mt-2 flex items-center text-sm">
						<div
							class={salesGrowth >= 0
								? 'flex items-center text-green-500'
								: 'flex items-center text-red-500'}
						>
							{#if salesGrowth >= 0}
								<ArrowUp size={14} />
							{:else}
								<ArrowDown size={14} />
							{/if}
							<span class="ml-1">{Math.abs(salesGrowth)}%</span>
						</div>
						<span class="ml-1 text-gray-500 dark:text-gray-400">vs last period</span>
					</div>
				</div>
			</div>

			<div class="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
				<div class="flex flex-col">
					<span class="text-sm text-gray-500 dark:text-gray-400">Total Orders</span>
					<span class="text-2xl font-bold text-gray-900 dark:text-white">{totalOrders}</span>
					<div class="mt-2 flex items-center text-sm">
						<div class="flex items-center text-green-500">
							<ArrowUp size={14} />
							<span class="ml-1">8.2%</span>
						</div>
						<span class="ml-1 text-gray-500 dark:text-gray-400">vs last period</span>
					</div>
				</div>
			</div>

			<div class="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
				<div class="flex flex-col">
					<span class="text-sm text-gray-500 dark:text-gray-400">Avg. Order Value</span>
					<span class="text-2xl font-bold text-gray-900 dark:text-white"
						>{formatCurrency(averageOrderValue)}</span
					>
					<div class="mt-2 flex items-center text-sm">
						<div class="flex items-center text-green-500">
							<ArrowUp size={14} />
							<span class="ml-1">3.7%</span>
						</div>
						<span class="ml-1 text-gray-500 dark:text-gray-400">vs last period</span>
					</div>
				</div>
			</div>

			<div class="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
				<div class="flex flex-col">
					<span class="text-sm text-gray-500 dark:text-gray-400">Items Sold</span>
					<span class="text-2xl font-bold text-gray-900 dark:text-white">432</span>
					<div class="mt-2 flex items-center text-sm">
						<div class="flex items-center text-red-500">
							<ArrowDown size={14} />
							<span class="ml-1">2.1%</span>
						</div>
						<span class="ml-1 text-gray-500 dark:text-gray-400">vs last period</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Sales chart -->
		<div class="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-lg font-semibold text-gray-900 dark:text-white">Sales Trend</h2>
			</div>
			<div class="h-64">
				<canvas bind:this={salesChartCanvas}></canvas>
			</div>
		</div>

		<!-- Recent transactions -->
		<div class="rounded-lg bg-white shadow dark:bg-gray-800">
			<div
				class="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700"
			>
				<h2 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
				<button class="text-sm font-medium text-primary">View All</button>
			</div>
			<div class="divide-y divide-gray-200 dark:divide-gray-700">
				{#each recentTransactions as transaction}
					<div class="p-4">
						<div class="flex items-start justify-between">
							<div>
								<div class="font-medium text-gray-900 dark:text-white">{transaction.id}</div>
								<div class="text-sm text-gray-500 dark:text-gray-400">{transaction.customer}</div>
								<div class="text-xs text-gray-500 dark:text-gray-400">{transaction.date}</div>
							</div>
							<div class="text-right">
								<div class="font-medium text-gray-900 dark:text-white">
									{formatCurrency(transaction.amount)}
								</div>
								<div
									class="mt-1 inline-block rounded-full bg-green-100 px-2 py-1 text-xs text-green-800 dark:bg-green-900 dark:text-green-200"
								>
									{transaction.status}
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</main>

	<!-- Bottom navigation -->
	<div class="fixed bottom-4 right-4 z-10">
		<button class="hover:bg-primary-dark rounded-full bg-primary p-4 text-white shadow-lg">
			<Plus size={24} />
		</button>
	</div>

	<nav
		class="sticky bottom-0 flex justify-around border-t border-gray-200 bg-white px-6 py-2 dark:border-gray-700 dark:bg-gray-800"
	>
		<button class="flex flex-col items-center p-2 text-primary">
			<ShoppingBag size={20} />
			<span class="mt-1 text-xs">Sales</span>
		</button>
		<button class="flex flex-col items-center p-2 text-gray-500 dark:text-gray-400">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
				<path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
			</svg>
			<span class="mt-1 text-xs">Inventory</span>
		</button>
		<button class="flex flex-col items-center p-2 text-gray-500 dark:text-gray-400">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
				<circle cx="9" cy="7" r="4"></circle>
				<path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
				<path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
			</svg>
			<span class="mt-1 text-xs">Customers</span>
		</button>
		<button class="flex flex-col items-center p-2 text-gray-500 dark:text-gray-400">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<circle cx="12" cy="12" r="3"></circle>
				<path
					d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
				></path>
			</svg>
			<span class="mt-1 text-xs">Settings</span>
		</button>
	</nav>
</div>
