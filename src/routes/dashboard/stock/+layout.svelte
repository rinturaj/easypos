<script lang="ts">
	import Button from '../../../lib/components/ui/button/button.svelte';
	import * as Card from '../../../lib/components/ui/card';
	import { PlusCircle } from 'lucide-svelte';
	import Adduser from '../../../lib/components/custom/adduser.svelte';
	import { componentSide } from '../../../lib/component.store';
	import AddStock from '../../../lib/components/custom/addStock.svelte';

	componentSide.set(null);

	function addComponent() {
		componentSide.set(AddStock);
	}
</script>

<div class="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
	<div class="flex items-center justify-between space-y-2">
		<div>
			<h2 class="text-2xl font-bold tracking-tight">Stock Details</h2>
			<p class="text-muted-foreground">Details about stock</p>
		</div>
		<div class="flex items-center space-x-2">
			<!-- <UserNav /> -->
			<Button on:click={addComponent}>
				<span class="px-2">
					<PlusCircle size={14}></PlusCircle>
				</span>
				Add</Button
			>
		</div>
	</div>
	<!-- <Card.Root class="w-100">
		<Card.Content> -->
	<slot></slot>
	<!-- </Card.Content>
	</Card.Root> -->
</div>
 