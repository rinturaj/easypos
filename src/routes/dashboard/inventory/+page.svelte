<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import StockOverview from '../../../lib/components/custom/StockOverview.svelte';
	import StockList from '../../../lib/components/custom/StockList.svelte';
</script>

<Tabs.Root value="overview">
	<Tabs.List class="grid grid-cols-2 md:w-[400px]">
		<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
		<Tabs.Trigger value="stocklist">Stock List</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="overview">
		<StockOverview></StockOverview>
	</Tabs.Content>
	<Tabs.Content value="stocklist">
		<StockList></StockList>
	</Tabs.Content>
</Tabs.Root>
