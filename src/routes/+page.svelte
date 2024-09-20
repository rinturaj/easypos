<script lang="ts">
	import { base } from '$app/paths';

	import Button from '../lib/components/ui/button/button.svelte';
	import { db } from '../database/db';
	import { onMount } from 'svelte';
	import Input from '../lib/components/ui/input/input.svelte';
	import Label from '../lib/components/ui/label/label.svelte';
	import { cn } from '../lib/utils';
	import { buttonVariants } from '../lib/components/ui/button';
	import { LoginApi } from '../database/dbactivity';
	import { goto } from '$app/navigation';
	import { Beaker } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { login } from '../lib/component.store';
	// import { ipcRenderer } from 'electron';

	onMount(async () => {
		db.userAccount.add({
			id: 1,
			email: 'admin',
			password: '1122',
			name: 'admin'
		});
	});
	let email = '';
	let password = '';
	let disabled = true;
</script>

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
		<div class="relative z-20 mt-auto">
			<blockquote class="space-y-2">
				<p class="text-lg"></p>
				<footer class="text-sm"></footer>
			</blockquote>
		</div>
	</div>
	<div class="lg:p-8">
		<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
			<div class="flex flex-col space-y-2 text-center">
				<h1 class="text-2xl font-semibold tracking-tight">Please Login</h1>
				<p class="text-sm text-muted-foreground">Enter your email and password below to login</p>

				<!-- <Label class="text-left">Email</Label> -->
				<Input placeholder="email" bind:value={email}></Input>
				<!-- <Label class="text-left">password</Label> -->
				<Input placeholder="password" bind:value={password}></Input>
				<button
					class={cn(
						buttonVariants({ variant: 'default' }),
						(!email || !password) && 'pointer-events-none opacity-50'
					)}
					on:click={async () => {
						console.log('clicked');
						// ipcRenderer.send('ping-good', 'ping');

						let logged = await LoginApi.login(email, password);
						if (logged) {
							goto(base + '/dashboard/overview');
							login();
							toast.success('Welcome to Petromax ');
						} else {
							toast.error('Invalid Credentials ', {
								description: 'Your email or password is invalid. Please try again'
							});
						}
					}}>Login</button
				>
			</div>
		</div>
	</div>
</div>
