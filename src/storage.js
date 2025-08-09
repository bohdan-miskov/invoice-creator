import { saveAs } from "file-saver";

// Дата
export function initInvoiceDate() {
  const input = document.getElementById("invoiceDate");
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  input.value = `${yyyy}-${mm}-${dd}`;
}

// Номер накладної
export function loadInvoiceNumber() {
  const data = localStorage.getItem("lastInvoiceNumber");
  return data
    ? Number(JSON.parse(data)) + 43
    : Math.floor(100000 + Math.random() * 900000);
}

export function saveInvoiceNumber(number) {
  localStorage.setItem("lastInvoiceNumber", JSON.stringify(number));
}

// Товари
export function loadProductsFromStorage() {
  const data = localStorage.getItem("products");
  return data ? JSON.parse(data) : [];
}

export function saveProductsToStorage(products) {
  localStorage.setItem("products", JSON.stringify(products));
}

export function updateProductDatalist() {
  const datalist = document.getElementById("products");
  datalist.innerHTML = "";
  loadProductsFromStorage().forEach((prod) => {
    const option = document.createElement("option");
    option.value = prod;
    datalist.appendChild(option);
  });
}

// Додавання рядка
export function addProductRow() {
  const container = document.getElementById("items");
  const row = document.createElement("div");
  row.classList.add("item-row");
  row.innerHTML = `
    <input name="productName" list="products" placeholder="Назва товару" required>
    <input name="qty" type="number" step="1" placeholder="Кількість" required>
    <input name="measurementUnit" placeholder="Одиниця вимірювання" required/>
    <input name="price" type="number" step="0.01" placeholder="Ціна" required>
  `;
  container.appendChild(row);
}

// Директорія
export let directoryHandle = null;

export async function chooseDirectory() {
  try {
    directoryHandle = await window.showDirectoryPicker();
    localStorage.setItem("saveDirName", directoryHandle.name);
    window.directoryHandle = directoryHandle;
    document.getElementById(
      "chosenPathLabel"
    ).textContent = `✓ ${directoryHandle.name}`;
  } catch (err) {
    console.warn("Вибір директорії скасовано", err);
  }
}

export async function saveToDirectory(blob, fileName) {
  try {
    if (!directoryHandle) {
      saveAs(blob, fileName);
      showSaveStatus(`Файл "${fileName}" збережено локально.`);
      return;
    }

    const fileHandle = await directoryHandle.getFileHandle(fileName, {
      create: true,
    });
    const writable = await fileHandle.createWritable();
    await writable.write(blob);
    await writable.close();

    showSaveStatus(
      `Файл "${fileName}" успішно збережено в директорії "${directoryHandle.name}".`
    );
  } catch (err) {
    console.error("Помилка при збереженні:", err);
    showSaveStatus("❌ Помилка при збереженні файлу.", true);
  }
}

export function showSaveStatus(message, isError = false) {
  const statusDiv = document.getElementById("saveStatus");
  statusDiv.textContent = message;
  statusDiv.style.color = isError ? "red" : "green";
  setTimeout(() => {
    statusDiv.textContent = "";
  }, 5000);
}
