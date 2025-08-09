import { generateDocx } from "./docxGenerator";
import {
  addProductRow,
  chooseDirectory,
  initInvoiceDate,
  loadInvoiceNumber,
  updateProductDatalist,
} from "./storage";

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
