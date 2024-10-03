<script lang="ts">
	let fileContent: string | ArrayBuffer | null;
	let selectedFile: string;
	let fileHandle: any;

	// Open file dialog and read file content
	async function openFile() {
		try {
			// Open the file picker dialog
			[fileHandle] = await window.showOpenFilePicker({
				types: [
					{
						description: 'Text Files',
						accept: {
							'text/plain': ['.json']
						}
					}
				]
			});

			const file = await fileHandle.getFile();
			selectedFile = file.name;
			const reader = new FileReader();
			reader.onload = (event) => {
				if (!!event && !!event.target) fileContent = event.target.result;
			};
			reader.readAsText(file);
		} catch (error) {
			console.error('Error opening file: ', error);
		}
	}

	// Save file changes back to the filesystem
	async function saveFile() {
		try {
			const writableStream = await fileHandle.createWritable();
			await writableStream.write(fileContent);
			await writableStream.close();
			alert('File saved successfully!');
		} catch (error) {
			console.error('Error saving file: ', error);
		}
	}
</script>

<div>
	<button on:click={openFile}>Open File</button>
	{#if selectedFile}
		<p>Editing: {selectedFile}</p>
		<textarea class="text-white" bind:value={fileContent}></textarea>
		<button on:click={saveFile}>Save File</button>
	{/if}
</div>

<style>
	textarea {
		width: 100%;
		height: 200px;
		margin-top: 10px;
	}
</style>
