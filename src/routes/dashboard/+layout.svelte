<script lang="ts">
	import Aside from '../../lib/components/custom/Aside.svelte';
	import Header from '../../lib/components/custom/Header.svelte';
</script>

<div class="flex min-h-screen w-full flex-col bg-muted/40">
	<Aside></Aside>
	<div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
		<Header></Header>
		<main
			class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3"
		>
			<slot></slot>
		</main>
	</div>
</div>
