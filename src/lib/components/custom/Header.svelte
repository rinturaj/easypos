<script lang="ts">
	import PanelLeft from 'lucide-svelte/icons/panel-left';
	import Search from 'lucide-svelte/icons/search';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { UserCircle } from 'lucide-svelte';
	import Nav from './navbar.svelte';
	import { sheetOpen } from '../../component.store';
</script>

<header
	class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"
>
	<Sheet.Root>
		<Sheet.Trigger asChild let:builder>
			<Button builders={[builder]} size="icon" variant="outline" class="sm:hidden">
				<PanelLeft class="h-5 w-5" />
				<span class="sr-only">Toggle Menu</span>
			</Button>
		</Sheet.Trigger>
		<Sheet.Content side="left" class="sm:max-w-xs">
			<Nav></Nav>
		</Sheet.Content>
	</Sheet.Root>

	<div class="relative ml-auto flex-1 md:grow-0">
		<Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
		<Input
			type="search"
			placeholder="Search..."
			class="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
		/>
	</div>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<Button
				variant="outline"
				size="icon"
				class="overflow-hidden rounded-full"
				builders={[builder]}
			>
				<UserCircle></UserCircle>
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end">
			<DropdownMenu.Label>My Account</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<!-- <DropdownMenu.Item>Settings</DropdownMenu.Item> -->

			<DropdownMenu.Item>Logout</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</header>
