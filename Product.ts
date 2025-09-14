import { UnitConverter } from "./UnitConverter";

export class Product {
    public name: string;
    public price: number; // Price in THB
    public quantity: number; // Quantity in mg or ml
    public unit: string; // "mg" or "ml"

    constructor(name: string, price: number, quantity: number, unit: string) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.unit = unit;
    }

    getBaseQuantity(): number {
        if (['kg', 'g', 'mg'].includes(this.unit)) {
            return UnitConverter.convert(this.quantity, this.unit, 'mg');
        } else if (['l', 'ml'].includes(this.unit)) {
            return UnitConverter.convert(this.quantity, this.unit, 'ml');
        } else {
            throw new Error(`Unsupported unit: ${this.unit}`);
        }
    }

    getUnitPrice(): number {
        return this.price / this.getBaseQuantity(); // Price per mg or ml
    }
}
