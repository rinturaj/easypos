<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { componentSide } from '../../component.store';
	import Button from '../ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import type { Expenses } from '../../../database/model';
	import { db } from '../../../database/db';
	import { format } from 'date-fns';

	let newData: Expenses = {
		amount: 0,
		createdOn: new Date(),
		note: '',
		title: ''
	};

	let add = () => {
		db.expenses.add(newData);
		componentSide.set(null);
	};

	$: formattedcreatedOn = format(newData.createdOn, 'yyyy-MM-dd');

	function handleDateChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const createdOn = new Date(input.value);
		if (!isNaN(createdOn.getTime())) {
			newData.createdOn = createdOn;
		}
	}
</script>

<div class="w-full p-3">
	<!-- <Card.Root> -->
	<Card.Header>
		<Card.Title>Add Expenses</Card.Title>
		<Card.Description>Create or update Expenses details</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="grid gap-6">
			<div class="grid gap-3">
				<Label for="name">Date</Label>
				<Input
					id="name"
					type="date"
					value={formattedcreatedOn}
					on:input={handleDateChange}
					class="block w-full"
					placeholder="Date here"
				/>
			</div>
			<div class="grid gap-3">
				<Label for="name">Title</Label>
				<Input
					id="name"
					type="text"
					bind:value={newData.title}
					class="w-full"
					placeholder="Title here"
				/>
			</div>
			<div class="grid gap-3">
				<Label for="name">Note</Label>
				<Textarea id="name" class="w-full" bind:value={newData.note} placeholder="Note here" />
			</div>
			<div class="grid gap-3">
				<Label for="name">Amount</Label>
				<Input
					id="name"
					type="number"
					bind:value={newData.amount}
					class="w-full"
					placeholder="Amount here"
				/>
			</div>
		</div></Card.Content
	>
	<Card.Footer class="justify-end">
		<Button
			on:click={() => {
				componentSide.set(null);
			}}
			variant="outline"
			class="mr-3">Cancel</Button
		>
		<Button disabled={newData.amount == 0 || newData.title == ''} on:click={add}>Add</Button>
	</Card.Footer>
	<!-- </Card.Root> -->
</div>
