<script lang="ts">
	import { goto } from '$app/navigation';
	import { db } from '../database/db';
	import Button from '../lib/components/ui/button/button.svelte';

	async function login() {
		db.cloud.currentUser.subscribe((data) => {
			if (data.isLoggedIn) goto('/dashboard');
		});
	}
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
				<Button class="" on:click={login}>Login</Button>
			</div>
		</div>
	</div>
</div>
