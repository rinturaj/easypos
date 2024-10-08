import { writable } from 'svelte/store';

export const componentSide = writable();
export const componentData = writable();
export const importStatus = writable(0);

export const isAuthenticated = writable(true);
export const sheetOpen = writable(false);

export function login() {
	isAuthenticated.set(true);
}

export function logout() {
	isAuthenticated.set(false);
}
