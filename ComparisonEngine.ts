
import { Product } from './Product';

class ComparisonEngine {
  compare(products: Product[]) {
    const unitPrices = new Map<Product, number>();
    for (const product of products) {
      unitPrices.set(product, product.getUnitPrice());
    }

    let bestProduct = products[0];
    for (const product of products) {
      if (product.getUnitPrice() < bestProduct.getUnitPrice()) {
        bestProduct = product;
      }
    }

    return { bestProduct, unitPrices };
  }
}
