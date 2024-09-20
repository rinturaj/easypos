<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { componentSide } from '../../component.store';
	import Button from '../ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import type { CreditModel } from '../../../database/model';
	import { db } from '../../../database/db';
	import { format } from 'date-fns';
	import { liveQuery } from 'dexie';

	let newData: CreditModel = {
		amount: 0,
		createdOn: new Date(),
		note: '',
		phoneNumber: '',
		name: '',
		type: '',
		vehicle: ''
	};

	$: formattedcreatedOn = format(newData.createdOn, 'yyyy-MM-dd');

	$: creditListName = liveQuery(async () => {
		return [...new Set((await db.credit.toArray()).map((x) => x.name))];
	});
	let add = () => {
		newData.name = newData.name.toUpperCase();
		db.credit.add(newData);
		componentSide.set(null);
	};

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
		<Card.Title>Add Credit</Card.Title>
		<Card.Description>Create or update Credit details</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="grid grid-cols-2 gap-6">
			<div class="grid gap-3">
				<Label for="name">Date</Label>
				<Input
					id="name"
					value={formattedcreatedOn}
					on:input={handleDateChange}
					type="date"
					class="block w-full"
					placeholder="date here"
				/>
			</div>
			<div class="grid gap-3">
				<Label for="name">Vehicle Number</Label>
				<Input
					bind:value={newData.vehicle}
					id="name"
					type="text"
					class="w-full"
					placeholder="Vehicle Number here"
				/>
			</div>
			<div class="grid gap-3">
				<Label for="name">Name</Label>
				<Input
					id="name"
					bind:value={newData.name}
					type="text"
					list="browsers"
					class="w-full"
					autocomplete="off"
					placeholder="Item name here"
				/>

				<datalist id="browsers">
					{#if !!$creditListName && $creditListName.length > 0}
						{#each $creditListName as name}
							<option value={name}> {name}</option>
						{/each}
					{/if}
				</datalist>
			</div>
			<div class="grid gap-3">
				<Label for="name">PhoneNumber</Label>
				<Input
					id="name"
					type="text"
					bind:value={newData.phoneNumber}
					class="w-full"
					placeholder="Phonenumber here"
				/>
			</div>
			<div class="grid gap-3">
				<Label for="name">Type</Label>
				<Select.Root
					onSelectedChange={(v) => {
						v && (newData.type = '' + v.value);
					}}
				>
					<Select.Trigger>
						<Select.Value placeholder="Choose Type" />
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Type</Select.Label>
							{#each ['Credit', 'Settled Up'] as type}
								<Select.Item value={type} label={type}>{type}</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
					<Select.Input name="type" />
				</Select.Root>
			</div>
			<div class="grid gap-3">
				<Label for="name">Amount</Label>
				<Input
					id="name"
					type="number"
					bind:value={newData.amount}
					class="w-full"
					placeholder="name here"
				/>
			</div>
			<div class="grid gap-3">
				<Label for="name">Note</Label>
				<Input id="name" type="text" class="w-full" bind:value={newData.note} placeholder="note " />
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
		<Button
			disabled={newData.type == '' || newData.amount == 0 || newData.name == ''}
			on:click={add}>Add</Button
		>
	</Card.Footer>
	<!-- </Card.Root> -->
</div>
