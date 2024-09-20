<script lang="ts">
	import { componentSide } from '../../../lib/component.store';
	import AddNosil from '../../../lib/components/custom/addNosil.svelte';
	import Button from '../../../lib/components/ui/button/button.svelte';
	import { PlusCircle } from 'lucide-svelte';

	componentSide.set(null);

	function addComponent() {
		console.log('Adduser' + '');

		componentSide.set(AddNosil);
	}
</script>

<div class="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
	<div class="flex items-center justify-between space-y-2">
		<div>
			<h2 class="text-2xl font-bold tracking-tight">Nosil Details</h2>
			<p class="text-muted-foreground">All details about Nosil here</p>
		</div>
		<div class="flex items-center space-x-2">
			<!-- <UserNav /> -->
			<Button on:click={addComponent}>
				<span class="px-2">
					<PlusCircle size={14}></PlusCircle>
				</span>
				Create</Button
			>
		</div>
	</div>
	<slot></slot>
</div>
