<script lang="ts">
	import Aside from '../../lib/components/custom/Aside.svelte';
	import Header from '../../lib/components/custom/Header.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { componentData, componentSide } from '../../lib/component.store';
	import ScrollArea from '../../lib/components/ui/scroll-area/scroll-area.svelte';
	import Button from '../../lib/components/ui/button/button.svelte';
</script>

<div class="flex min-h-screen w-full flex-col bg-muted/40">
	<Aside></Aside>
	<div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
		<Header></Header>
		<main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
			<slot></slot>
		</main>
	</div>
</div>

<Dialog.Root open={$componentSide != null} closeOnOutsideClick={false} closeOnEscape={false}>
	<Dialog.Content class="max-w-5xl p-2 ">
		<ScrollArea class="max-h-screen min-h-96 p-2">
			<svelte:component this={$componentSide} data={$componentData} />
		</ScrollArea>
	</Dialog.Content>
</Dialog.Root>
