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

export const salesRoutes: Route[] = [
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
		title: 'Oil Sales',
		label: '',
		link: base + '/dashboard/oilsales',
		icon: Droplet,
		variant: 'ghost'
	},
	{
		title: 'Expenses ',
		label: '',
		link: base + '/dashboard/expenses',
		icon: DollarSign,
		variant: 'ghost'
	},
	{
		title: 'Credit ',
		label: '',
		link: base + '/dashboard/credit',
		icon: CreditCard,
		variant: 'ghost'
	}
];
export const primaryRoutes: Route[] = [
	{
		title: 'Stock',
		label: '',
		link: base + '/dashboard/stock',
		icon: Box,
		variant: 'ghost'
	},
	{
		title: 'Oil Stock',
		label: '',
		link: base + '/dashboard/oilstock',

		icon: PaintBucket,
		variant: 'ghost'
	},
	{
		title: 'Staff',
		label: '',
		link: base + '/dashboard/staff',

		icon: Icons.Users,
		variant: 'ghost'
	},
	{
		title: 'Nosil',
		label: '',
		link: base + '/dashboard/nosil',
		icon: Fuel,
		variant: 'ghost'
	},
	{
		title: 'Miscellaneous',
		label: '',
		link: base + '/dashboard/misc',
		icon: UtilityPole,
		variant: 'ghost'
	}
];
