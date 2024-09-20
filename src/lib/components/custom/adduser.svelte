<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { componentSide } from '../../component.store';
	import Button from '../ui/button/button.svelte';
	import { db } from '../../../database/db';
	import type { Staff } from '../../../database/model';
	import { toast } from 'svelte-sonner';

	let newData: Staff = {
		createdOn: new Date(),
		hourlyPrice: 0,
		name: '',
		status: true
	};

	let add = () => {
		db.staff.add(newData);
		componentSide.set(null);
		toast.success('Staff added successfully');
	};
</script>

<div class="w-full p-3">
	<!-- <Card.Root> -->
	<Card.Header>
		<Card.Title>Add User</Card.Title>
		<Card.Description>Create or update user details</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="grid gap-6">
			<div class="grid gap-3">
				<Label for="name">Name</Label>
				<Input
					bind:value={newData.name}
					id="name"
					type="text"
					class="w-full"
					placeholder="name here"
				/>
			</div>

			<div class="grid gap-3">
				<Label for="name">Hourly Charge</Label>
				<Input bind:value={newData.hourlyPrice} type="Number" class="w-full" placeholder="price " />
			</div>
		</div>
	</Card.Content>
	<Card.Footer class="justify-end">
		<Button
			on:click={() => {
				componentSide.set(null);
			}}
			variant="outline"
			class="mr-3">Cancel</Button
		>
		<Button disabled={newData.name == '' || newData.hourlyPrice == 0} on:click={add}>Add</Button>
	</Card.Footer>
	<!-- </xCard.Root> -->
</div>
