<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';
	import { cn } from '$lib/utils.js';
	import type { Icon } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';
	import { Fuel } from 'lucide-svelte';
	import { UserRoundCog } from 'lucide-svelte';
	import { Label } from 'bits-ui';
	import { redirect } from '@sveltejs/kit';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';

	export let isCollapsed: boolean;

	type Account = {
		label: string;
		icon: ComponentType<Icon>;
	};
	let accounts: Account[] = [
		{
			label: 'Sales',
			icon: Fuel
		},
		{
			label: 'Master',
			icon: UserRoundCog
		}
	];

	export let selectedAccount = accounts[0];
</script>

<Select.Root
	portal={null}
	selected={{ value: selectedAccount.label, label: selectedAccount.label }}
	onSelectedChange={(e) => {
		selectedAccount = accounts.find((account) => account.label === e?.value) || accounts[0];
		let url = `${base}/${selectedAccount.label == 'Sales' ? 'dashboard/overview' : 'dashboard/stock'}`;
		console.log(url);

		goto(url);
	}}
>
	<Select.Trigger
		class={cn(
			'flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0',
			isCollapsed &&
				'flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>div>svg]:hidden [&>span]:w-auto'
		)}
		aria-label="Select account"
	>
		<span class="pointer-events-none">
			<svelte:component this={selectedAccount.icon} class={cn(isCollapsed ? 'ml-2' : '')} />
			<span class={cn(isCollapsed ? '!ml-0 !hidden' : 'ml-2')}>
				{selectedAccount.label}
			</span>
		</span>
	</Select.Trigger>
	<Select.Content sameWidth={!isCollapsed} align={isCollapsed ? 'start' : undefined}>
		<Select.Group>
			{#each accounts as account}
				<Select.Item value={account.label} label={account.label}>
					<div
						class="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground"
					>
						<svelte:component
							this={account.icon}
							aria-hidden="true"
							class="size-4 shrink-0 text-foreground"
						/>
						{account.label}
					</div>
				</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
	<Select.Input hidden name="account" />
</Select.Root>
