<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { componentSide } from '../../component.store';
	import Button from '../ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import type { Nosil } from '../../../database/model';
	import { db } from '../../../database/db';

	let newData: Nosil = {
		reading: 0,
		name: '',
		type: ''
	};
	let add = () => {
		db.nosil.add(newData);
		componentSide.set(null);
	};
</script>

<div class="w-full p-3">
	<!-- <Card.Root> -->
	<Card.Header>
		<Card.Title>Add Nosil</Card.Title>
		<Card.Description>Create or update Nosil details</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="grid gap-6">
			<div class="grid gap-3">
				<Label for="name">Nosile Name</Label>
				<Input
					id="name"
					bind:value={newData.name}
					type="text"
					class="w-full"
					placeholder="name here"
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
							{#each ['petrol', 'diesel'] as type}
								<Select.Item value={type} label={type}>{type}</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>
			<div class="grid gap-3">
				<Label for="description">Current Reading</Label>
				<Input id="description" bind:value={newData.reading} />
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
		<Button disabled={newData.name == '' || newData.type == ''} on:click={add}>Add</Button>
	</Card.Footer>
	<!-- </Card.Root> -->
</div>
