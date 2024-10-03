import { Box, ChartPie, DollarSign, Percent, Tag, type Icon } from 'lucide-svelte';
import type { ComponentType } from 'svelte';
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
		icon: DollarSign,
		variant: 'ghost'
	},
	{
		title: 'Margin',
		label: '',
		link: base + '/dashboard/margin',
		icon: Percent,
		variant: 'ghost'
	},
	{
		title: 'Inventory ',
		label: '',
		link: base + '/dashboard/inventory',
		icon: Box,
		variant: 'ghost'
	},
	{
		title: 'Products ',
		label: '',
		link: base + '/dashboard/products',
		icon: Tag,
		variant: 'ghost'
	}
];
