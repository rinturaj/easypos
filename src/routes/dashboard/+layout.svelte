<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable/index';
	import { Separator } from '$lib/components/ui/separator';
	import Nav from '$lib/components/custom/nav.svelte';
	import { primaryRoutes, salesRoutes } from '../../lib/config';
	import AccountSwitcher from '../../lib/components/custom/account-switcher.svelte';
	import { cn } from '../../lib/utils';
	import ScrollArea from '../../lib/components/ui/scroll-area/scroll-area.svelte';
	import { componentData, componentSide, isAuthenticated, logout } from '../../lib/component.store';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Button from '../../lib/components/ui/button/button.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { FolderSync, LogOut } from 'lucide-svelte';
	import { db, isStoragePersisted, persist } from '../../database/db';
	import { base } from '$app/paths';

	export let defaultLayout = [265, 655, 340];
	export let defaultCollapsed = false;
	export let navCollapsedSize = 4;

	export let data;

	onMount(() => {
		if (!$isAuthenticated) {
			goto('/');
		}
	});

	console.log(data);

	let selectedAcount: any;

	let isCollapsed = defaultCollapsed;

	function onLayoutChange(sizes: number[]) {
		document.cookie = `PaneForge:layout=${JSON.stringify(sizes)}`;
	}

	function onCollapse() {
		isCollapsed = true;
		document.cookie = `PaneForge:collapsed=${true}`;
	}

	function onExpand() {
		isCollapsed = false;
		document.cookie = `PaneForge:collapsed=${false}`;
	}
	(window as any).electron?.onSyncDatabaseResponse((response: any) => {
		console.log(response);
	});
	async function syncDatabase() {
		(window as any).electron.syncDatabase('Requesting database sync...');

		// const status = await isStoragePersisted();
		// console.log(status);

		// const inboxBucket = await (navigator as any).storageBuckets.open('petromax');
		// console.log(inboxBucket);

		// let idb = await inboxBucket.indexedDB.open('petromax');
		// console.log(idb);

		// // idb.add()
		// if (!status) {
		// 	await persist();
		// 	console.log('Make storage persistent now?', console.log('denied'), true);
		// }

		// if (navigator.storage && navigator.storage.persist) {
		// 	const isPersisted = await navigator.storage.persist();
		// 	console.log(`Persisted storage granted: ${isPersisted}`);
		// }

		// let dirHandle = await navigator.storage.getDirectory();
		// const handle = await dirHandle.getFileHandle('sync_data.json', { create: true });
		// console.log(handle);

		// await handle.requestPermission({ mode: 'readwrite', writable: true });
		// const writable = await handle.createWritable({
		// 	keepExistingData: false
		// });
		// await writable.write(JSON.stringify(await db.price.toArray()));
		// await writable.close();
		// console.log(await handle.getFile());
	}
</script>

<div class="hidden h-screen md:block">
	<Resizable.PaneGroup direction="horizontal" {onLayoutChange} class="h-full items-stretch">
		<Resizable.Pane
			defaultSize={defaultLayout[0]}
			collapsedSize={navCollapsedSize}
			collapsible
			minSize={15}
			maxSize={20}
			{onCollapse}
			{onExpand}
		>
			<div class="flex h-full flex-col justify-between">
				<div>
					<div
						class={cn(
							'm-1 flex h-[52px] items-center rounded-md bg-slate-950 font-extrabold text-white',
							isCollapsed ? 'h-[52px] justify-center' : 'justify-start px-2'
						)}
					>
						{#if isCollapsed}
							<h5>P</h5>
						{:else}
							<h5>Petromax</h5>
						{/if}
					</div>
					<Separator />
					<div
						class={cn(
							'flex h-[52px] items-center justify-center',
							isCollapsed ? 'h-[52px]' : 'px-2'
						)}
					>
						<AccountSwitcher bind:selectedAccount={selectedAcount} {isCollapsed} />
					</div>
					<Separator />
					<Nav
						{isCollapsed}
						routes={selectedAcount?.label == 'Sales' ? salesRoutes : primaryRoutes}
					/>
				</div>
				<div>
					<Separator />
					<div class="p-2 text-center">
						{#if isCollapsed}
							<Button
								on:click={() => {
									logout();
									goto({ base } + '/');
								}}
								variant="outline"
								size="icon"><LogOut></LogOut></Button
							>
						{:else}
							<Button
								on:click={() => {
									logout();
									goto({ base } + '/');
								}}
								class="w-full"
								variant="outline"
								size="sm"
							>
								<LogOut class="mr-2" size={14}></LogOut>Logout</Button
							>
						{/if}
					</div>
				</div>
			</div>
		</Resizable.Pane>
		<Resizable.Handle withHandle />
		<Resizable.Pane defaultSize={defaultLayout[1]} minSize={30} class="bg-slate-100">
			<ScrollArea class="h-screen">
				<slot></slot>
			</ScrollArea>
		</Resizable.Pane>
	</Resizable.PaneGroup>
</div>

<Dialog.Root open={$componentSide != null} closeOnOutsideClick={false} closeOnEscape={false}>
	<Dialog.Content class="max-w-5xl p-0">
		<svelte:component this={$componentSide} data={$componentData} />
	</Dialog.Content>
</Dialog.Root>
