import type { ProductStock, StockOverview } from '../database/model';

export function updateStockOverview(
	stockOverview: StockOverview,
	productStocks: ProductStock[]
): StockOverview {
	// Filter stocks belonging to the same product as the stockOverview
	const relevantStocks = productStocks
		.filter((stock) => stock.name === stockOverview.name)
		.filter((x) => x.remainingQty > 0);

	// Calculate total value and total quantity
	let totalValue = 0;
	let totalQuantity = 0;

	relevantStocks.forEach((stock) => {
		totalValue += Number(stock.purchaseRate);
		totalQuantity += Number(stock.quantity);
	});

	// Calculate the average price and update stock overview
	const averagePrice = totalQuantity ? Number(totalValue / totalQuantity) : 0;
	stockOverview.averagePrice = Number(averagePrice.toFixed(2));
	stockOverview.currentQuantity = totalQuantity;
	stockOverview.totalValue = totalValue;

	return stockOverview;
}

function updateStockAfterSale(stockOverview: StockOverview, itemsSold: number): StockOverview {
	// Check if there are enough items to sell
	if (itemsSold > stockOverview.currentQuantity) {
		throw new Error('Insufficient stock to sell');
	}

	// Update the current quantity after sale
	stockOverview.currentQuantity -= itemsSold;

	// The average price remains the same as it is based on purchase rates, not sales
	return stockOverview;
}

function updateStockAfterSaleWithAveragePrice(
	stockOverview: StockOverview,
	productStocks: ProductStock[],
	itemsSold: number
): StockOverview {
	let remainingToSell = itemsSold;

	// Sort product stocks by purchased date (FIFO)
	const sortedStocks = productStocks
		.filter((stock) => stock.id === stockOverview.productId)
		.sort((a, b) => a.purchasedOn.getTime() - b.purchasedOn.getTime());

	for (const stock of sortedStocks) {
		if (remainingToSell <= 0) break;

		if (stock.quantity <= remainingToSell) {
			remainingToSell -= stock.quantity;
			stock.quantity = 0;
		} else {
			stock.quantity -= remainingToSell;
			remainingToSell = 0;
		}
	}

	// Recalculate the average price based on remaining stocks
	let totalValue = 0;
	let totalQuantity = 0;

	sortedStocks.forEach((stock) => {
		totalValue += stock.purchaseRate * stock.quantity;
		totalQuantity += stock.quantity;
	});

	stockOverview.currentQuantity = totalQuantity;
	stockOverview.averagePrice = totalQuantity ? totalValue / totalQuantity : 0;

	return stockOverview;
}
