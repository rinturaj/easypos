<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { db } from '../database/db';
	import Button from '../lib/components/ui/button/button.svelte';

	async function login() {
		db.cloud.login();
		db.cloud.currentUser.subscribe((data) => {
			if (data.isLoggedIn) goto(base + '/dashboard');
		});
	}

	let device: BluetoothDevice | null = null;
	let server: BluetoothRemoteGATTServer | null = null;
	let printerCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;
	let status: string = '';

	// UUIDs may need to be changed for your printer
	const serviceUUID = '0000ffe0-0000-1000-8000-00805f9b34fb';
	const characteristicUUID = '0000ffe1-0000-1000-8000-00805f9b34fb';

	async function connectPrinter() {
		try {
			status = 'Requesting device...';

			device = await navigator.bluetooth.requestDevice({
				filters: [{ namePrefix: 'Printer' }], // adjust as needed
				optionalServices: [serviceUUID]
			});

			status = 'Connecting...';
			server = (await device.gatt?.connect()) ?? null;
			const service = await server?.getPrimaryService(serviceUUID);
			printerCharacteristic = (await service?.getCharacteristic(characteristicUUID)) ?? null;
			status = 'Connected!';
		} catch (e) {
			status = 'Connection failed: ' + e;
		}
	}

	async function printText(text: string) {
		if (!printerCharacteristic) {
			status = 'Printer not connected';
			return;
		}
		const encoder = new TextEncoder();
		// ESC @ (init), text, line feed
		const escpos = '\x1B\x40' + text + '\n';
		try {
			await printerCharacteristic.writeValue(encoder.encode(escpos));
			status = 'Printed: ' + text;
		} catch (e) {
			status = 'Print failed: ' + e;
		}
	}
</script>

<div class="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
	<div class="mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-md sm:p-8">
		<div class="space-y-6">
			<div class="space-y-2 text-center">
				<h1 class="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
					Welcome Back
				</h1>
				<p class="text-sm text-gray-600 sm:text-base">Sign in to access your account</p>
			</div>

			<div class="mt-6">
				<Button
					on:click={login}
					class="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
				>
					Sign in
				</Button>
			</div>
			<div>
				<Button on:click={connectPrinter}>Connect Printer</Button>
				<Button on:click={() => printText('Hello World!')}>Print "Hello World!"</Button>
				<p>{status}</p>
			</div>

			<div class="relative mt-6">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-gray-300"></div>
				</div>
				<div class="relative flex justify-center text-sm">
					<span class="bg-white px-2 text-gray-500">EasyPOS</span>
				</div>
			</div>
		</div>
	</div>
</div>

<div
	class="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
>
	<div class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
		<div
			class="absolute inset-0 bg-cover"
			style="
				background-image:
					url(https://images.unsplash.com/photo-1695018854357-546031da9e6b?q=80&w=2948&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D);"
		/>
		<div class="relative z-20 flex items-center rounded-xl">Petromax</div>
		<div class="relative z-20 mt-auto"></div>
	</div>
	<div class="lg:p-8">
		<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
			<div class="flex flex-col space-y-2 text-center">
				<h1 class="text-2xl font-semibold tracking-tight">Please Login</h1>
				<p class="text-sm text-muted-foreground">Enter your email and password below to login</p>
			</div>
		</div>
	</div>
</div>
