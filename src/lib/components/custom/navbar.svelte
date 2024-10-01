<script lang="ts">
	import Package2 from 'lucide-svelte/icons/package-2';
	import Settings from 'lucide-svelte/icons/settings';

	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { route } from '../../config';
</script>

<nav class="flex flex-col gap-4 px-2 py-4 md:items-center">
	<a
		href="##"
		class="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
	>
		<Package2 class="h-4 w-4 transition-all group-hover:scale-110" />
		<span class="sr-only">Simple Pos</span>
	</a>
	{#each route as r}
		<Tooltip.Root>
			<Tooltip.Trigger asChild let:builder>
				<div class="flex items-center justify-start align-middle">
					<a
						href={r.link}
						class="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
						use:builder.action
						{...builder}
					>
						<svelte:component this={r.icon} class="h-5 w-5" aria-hidden="true" />

						<span class="sr-only">{r.title}</span>
					</a>
					<span class="text-lg font-semibold sm:hidden">{r.title}</span>
				</div>
			</Tooltip.Trigger>
			<Tooltip.Content side="right">Dashboard</Tooltip.Content>
		</Tooltip.Root>
	{/each}
</nav>
<nav class="mt-auto flex flex-col gap-4 px-2 py-4 md:items-center">
	<Tooltip.Root>
		<Tooltip.Trigger asChild let:builder>
			<div class="flex items-center justify-start align-middle">
				<a
					href="#"
					class="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
					use:builder.action
					{...builder}
				>
					<Settings class="h-5 w-5" />
					<span class="sr-only">Settings</span>
				</a>
				<span class="text-lg font-semibold sm:hidden">Settings</span>
			</div>
		</Tooltip.Trigger>
		<Tooltip.Content side="right">Settings</Tooltip.Content>
	</Tooltip.Root>
</nav>
