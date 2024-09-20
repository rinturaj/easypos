<script lang="ts">
	import type { Route } from '../../config';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { navigating } from '$app/stores';
	import { page } from '$app/stores';

	export let isCollapsed: boolean;
	export let routes: Route[];
</script>

<div
	data-collapsed={isCollapsed}
	class="group flex flex-col justify-between gap-4 py-2 data-[collapsed=true]:py-2"
>
	<nav
		class="block grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2"
	>
		{#each routes as route}
			{#if isCollapsed}
				<Tooltip.Root openDelay={0}>
					<Tooltip.Trigger asChild let:builder>
						<Button
							href={route.link}
							builders={[builder]}
							variant={$page.url.pathname == 'dashboard/' + route.link ? 'default' : 'ghost'}
							size="icon"
							class={cn(
								'size-9',
								($page.url.pathname == 'dashboard/' + route.link ? 'default' : 'ghost') ===
									'default' &&
									'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white'
							)}
						>
							<svelte:component this={route.icon} class="size-4" aria-hidden="true" />
							<span class="sr-only">{route.title}</span>
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content side="right" class="flex items-center gap-4">
						{route.title}
						{#if route.label}
							<span class="ml-auto text-muted-foreground">
								{route.label}
							</span>
						{/if}
					</Tooltip.Content>
				</Tooltip.Root>
			{:else}
				<Button
					href={route.link}
					variant={$page.url.pathname == route.link ? 'default' : 'ghost'}
					size="sm"
					class={cn('justify-start', {
						'dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white':
							($page.url.pathname == route.link ? 'default' : 'ghost') === 'default'
					})}
				>
					<svelte:component this={route.icon} class="mr-2 size-4" aria-hidden="true" />
					{route.title}
					{#if route.label}
						<span
							class={cn('ml-auto', {
								'text-background dark:text-white':
									($page.url.pathname == 'dashboard/' + route.link ? 'default' : 'ghost') ===
									'default'
							})}
						>
							{route.label}
						</span>
					{/if}
				</Button>
			{/if}
		{/each}
	</nav>
</div>
