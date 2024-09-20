<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { liveQuery } from 'dexie';
	import Label from '../../../lib/components/ui/label/label.svelte';
	import { db } from '../../../database/db';
	import Button from '../../../lib/components/ui/button/button.svelte';
	import { PriceApi } from '../../../database/dbactivity';
	import { Trash } from 'svelte-radix';
	import { DataImport } from '../../../lib/DataImport';
	import { CheckCheck, Loader } from 'lucide-svelte';

	$: price = liveQuery(async () => {
		let p = await db.price.get(1);

		return p;
	});
	let petrol: number;
	let diesel: number;
	let addPrice = () => {
		PriceApi.add(petrol, diesel);
	};
	function deleteFile(index: number) {
		fileToImport.splice(index, 1);
		fileToImport = fileToImport;
	}

	let fileToImport: { file: File; progress: number; status: boolean }[] = [];

	function importFile() {
		fileToImport.forEach(async (x) => {
			x.progress = await DataImport.import(x.file);
			x.status = true;
			fileToImport = fileToImport;
		});
	}
	async function getNewFileHandle() {
		const options: OpenFilePickerOptions = {
			multiple: true, // Allow multiple file selection
			types: [
				{
					description: 'Josn Files',
					accept: {
						'text/plain': ['.json']
					}
				}
			]
		};
		const handle = await window.showOpenFilePicker(options);
		for await (const entry of handle.values()) {
			if (entry.kind === 'file') {
				fileToImport.push({
					file: await entry.getFile(),
					progress: 0,
					status: false
				});
				fileToImport = fileToImport;
			}
		}
	}
</script>

<div class="flex min-h-screen w-full flex-col bg-muted/40 p-4">
	<div class="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
		<div class="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
			<Card.Root class="sm:col-span-2">
				<Card.Header class="pb-3">
					<Card.Title>Update Price</Card.Title>
					<Card.Description>last updated on 22-05-1993</Card.Description>
				</Card.Header>
				<Card.Footer class="flex items-end">
					<Label>
						Petrol Price
						<Input bind:value={petrol} class="mt-1" placeholder="price"></Input>
					</Label>
					<Label class="ml-2">
						Diesel Price
						<Input bind:value={diesel} class="mt-1" placeholder="price"></Input>
					</Label>
					<Button disabled={!petrol || !diesel} on:click={addPrice} class="ml-2">add</Button>
				</Card.Footer>
			</Card.Root>
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Description>Petrol Price</Card.Description>
					<Card.Title class="currency text-4xl">{$price?.petrol || 'NA'}</Card.Title>
				</Card.Header>
			</Card.Root>
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Description>Diesel Price</Card.Description>
					<Card.Title class="currency text-4xl">{$price?.diesel || 'NA'}</Card.Title>
				</Card.Header>
			</Card.Root>
			<Card.Root class="sm:col-span-4">
				<Card.Header class="pb-3">
					<Card.Title>Import Data</Card.Title>
					<Card.Description class=" text-balance leading-relaxed">
						Import your data from the JSON file into this application

						<ul>
							<ul class="space-y-2">
								{#each fileToImport as file, index}
									<li class="card flex items-center justify-between rounded-lg border bg-muted p-3">
										<span class="font-extrabold">{file.file.name}</span>

										<div class="flex items-center">
											{#if !file.status}
												<Button
													on:click={() => deleteFile(index)}
													type="button"
													variant="destructive"
													size="sm"
												>
													<Trash></Trash>
												</Button>
											{:else if file.progress < 100 && file.status == true}
												<span>
													<Loader class="animate-spin"></Loader>
												</span>
											{:else if file.progress == 100 && file.status == true}
												<CheckCheck class="text-green-800" />
											{/if}
										</div>
									</li>
									<!-- Display each file name with delete button and progress bar -->
								{/each}
							</ul>
						</ul>
					</Card.Description>
				</Card.Header>
				<Card.Footer>
					<Button class="mx-2" on:click={getNewFileHandle}>Load Files</Button>
					<Button disabled={fileToImport.length <= 0} on:click={importFile}>Import</Button>
				</Card.Footer>
			</Card.Root>
		</div>
	</div>
</div>
