// ประกาศ products ด้วย let เพื่อสามารถ assign ใหม่ได้
let products = [];

// โหลดข้อมูลจาก localStorage ตอนเริ่มต้น
const savedProducts = JSON.parse(localStorage.getItem("products") || "[]");
products = savedProducts.map(p => ({ ...p })); // clone object

// อ้างอิง element
const form = document.getElementById("productForm");
const productItems = document.getElementById("productItems");
const clearProductsBtn = document.getElementById("clearProducts");
const compareBtn = document.getElementById("compareBtn");

// ฟังก์ชัน save ลง localStorage
function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
}

// แสดงรายการสินค้า
function renderProducts() {
    productItems.innerHTML = "";
    products.forEach((p, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${p.name} - ${p.quantity}${p.unit} - ${p.price} บาท
            <button class="edit-btn">แก้ไข</button>
            <button class="delete-btn">ลบ</button>
        `;
        productItems.appendChild(li);

        // ลบ
        li.querySelector(".delete-btn").addEventListener("click", () => {
            products.splice(index, 1);
            saveProducts();
            renderProducts();
        });

        // แก้ไข
        li.querySelector(".edit-btn").addEventListener("click", () => {
            const newName = prompt("ชื่อสินค้า:", p.name);
            const newQuantity = parseFloat(prompt("ปริมาณ:", p.quantity));
            const newUnit = prompt("หน่วย (mg,g,kg,ml,l):", p.unit);
            const newPrice = parseFloat(prompt("ราคา:", p.price));
            if (newName && newQuantity > 0 && newPrice > 0 && ["mg","g","kg","ml","l"].includes(newUnit)) {
                products[index] = { name: newName, quantity: newQuantity, unit: newUnit, price: newPrice };
                saveProducts();
                renderProducts();
            }
        });
    });
}

// แปลงหน่วยเป็น base (mg/ml)
function convertToBase(quantity, unit) {
    const rates = { kg: 1000000, g: 1000, mg: 1, l: 1000, ml: 1 };
    return rates[unit] ? quantity * rates[unit] : quantity;
}

// เพิ่มสินค้า
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const quantity = parseFloat(document.getElementById("quantity").value);
    const unit = document.getElementById("unit").value;
    const price = parseFloat(document.getElementById("price").value);
    if (!name || quantity <= 0 || price <= 0) { alert("กรอกข้อมูลให้ถูกต้อง"); return; }

    products.push({ name, quantity, unit, price });
    saveProducts();
    renderProducts();
    form.reset();
});

// ล้างสินค้าทั้งหมด
clearProductsBtn.addEventListener("click", () => {
    products = [];
    saveProducts();
    renderProducts();
});

// เปรียบเทียบราคาต่อหน่วย
compareBtn.addEventListener("click", () => {
    if (products.length < 2) { alert("กรุณาเพิ่มสินค้าขั้นต่ำ 2 รายการ"); return; }

    const hasLiquid = products.some(p => ["ml","l"].includes(p.unit));
    const hasSolid = products.some(p => ["mg","g","kg"].includes(p.unit));
    if (hasLiquid && hasSolid) { alert("ไม่สามารถเปรียบเทียบของเหลวกับของแข็งพร้อมกันได้"); return; }

    let bestPrice = Infinity;
    const unitPrices = products.map(p => {
        const baseQty = convertToBase(p.quantity, p.unit);
        const unitPrice = p.price / baseQty;
        if (unitPrice < bestPrice) bestPrice = unitPrice;
        return { ...p, unitPrice };
    });

    let resultText = "ราคาต่อหน่วย:\n";
    unitPrices.forEach(p => {
        resultText += `${p.name}: ${p.unitPrice.toFixed(4)} บาท/หน่วย`;
        if (p.unitPrice === bestPrice) resultText += " ← คุ้มที่สุด";
        resultText += "\n";
    });
    alert(resultText);
});

// เริ่ม render ตอน load
renderProducts();
