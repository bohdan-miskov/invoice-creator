import {
  initInvoiceDate,
  loadInvoiceNumber,
  addProductRow,
  updateProductDatalist,
} from "./storage.js";
import { chooseDirectory, saveToDirectory, showSaveStatus } from "./storage.js";
import { generateDocx } from "./docxGenerator.js";

// Ініціалізація
initInvoiceDate();
updateProductDatalist();
document.querySelector('input[name="invoiceNumber"]').value =
  loadInvoiceNumber();

// Події
document.getElementById("addRowBtn").addEventListener("click", addProductRow);
document
  .getElementById("chooseDirBtn")
  .addEventListener("click", chooseDirectory);
document.getElementById("invoiceForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  await generateDocx(e.target);
});
