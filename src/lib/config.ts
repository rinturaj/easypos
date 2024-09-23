import {
	Box,
	ChartPie,
	CreditCard,
	DollarSign,
	Droplet,
	icons,
	UtilityPole,
	type Icon
} from 'lucide-svelte';
import type { ComponentType } from 'svelte';
import * as Icons from './icons';
import { Boxes } from 'lucide-svelte';
import { Fuel } from 'lucide-svelte';
import { PaintBucket } from 'lucide-svelte';
import { base } from '$app/paths';

export type Route = {
	title: string;
	label: string;
	link: string;
	icon: ComponentType<Icon>;
	variant: 'default' | 'ghost';
};

export const route: Route[] = [
	{
		title: 'Overview',
		label: '',
		link: base + '/dashboard/overview',
		icon: ChartPie,
		variant: 'ghost'
	},
	{
		title: 'Sales',
		label: '',
		link: base + '/dashboard/sales',
		icon: Box,
		variant: 'ghost'
	},
	{
		title: 'Margin',
		label: '',
		link: base + '/dashboard/oilsales',
		icon: Droplet,
		variant: 'ghost'
	},
	{
		title: 'Inventory ',
		label: '',
		link: base + '/dashboard/expenses',
		icon: DollarSign,
		variant: 'ghost'
	},
	{
		title: 'Category ',
		label: '',
		link: base + '/dashboard/credit',
		icon: CreditCard,
		variant: 'ghost'
	}
];
