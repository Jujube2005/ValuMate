export class UnitConverter {
    private static conversionRates: { [key: string]: number } = {
        // น้ำหนัก → แปลงเป็น mg
        "kg->mg": 1_000_000,
        "g->mg": 1000,
        "mg->mg": 1,

        // ปริมาตร → แปลงเป็น ml
        "l->ml": 1000,
        "ml->ml": 1,
    }

    public static convert(value: number, from: string, to: string): number {
        if (from === to) return value;
        const key = `${from}->${to}`;
        if (!(key in this.conversionRates)) {
            throw new Error(`Conversion from ${from} to ${to} not supported.`);
        }
        return value * this.conversionRates[key];
    }
}
