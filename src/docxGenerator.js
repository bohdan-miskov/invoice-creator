import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import {
  loadProductsFromStorage,
  saveInvoiceNumber,
  saveProductsToStorage,
  saveToDirectory,
  updateProductDatalist,
} from "./storage";
import { sumToWordsUA } from "./sumToWordsUa";
import templateUrl from "/template.docx?url";

export async function generateDocx(form) {
  const fileName = form.fileName.value.trim();
  const supplier = form.supplier.value.trim();
  const buyer = form.buyer.value.trim();
  const invoiceNumber = form.invoiceNumber.value.trim();
  const invoiceDate = new Date(form.invoiceDate.value);
  const invoiceDateShortString = form.invoiceDate.value;
  const invoiceFormattedDate = invoiceDate.toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const rows = Array.from(document.querySelectorAll("#items .item-row")).map(
    (row, index) => {
      const productName = row
        .querySelector('input[name="productName"]')
        .value.trim();
      const qty = parseFloat(row.querySelector('input[name="qty"]').value);
      const price = parseFloat(row.querySelector('input[name="price"]').value);
      const measurementUnit = row
        .querySelector('input[name="measurementUnit"]')
        .value.trim();
      const sum = +(qty * price).toFixed(2);
      return {
        no: index + 1,
        productName,
        qty,
        measurementUnit,
        price: price.toFixed(2),
        sum: sum.toFixed(2),
      };
    }
  );

  const total = rows.reduce((acc, r) => acc + parseFloat(r.sum), 0).toFixed(2);

  const allProducts = new Set([
    ...loadProductsFromStorage(),
    ...rows.map((r) => r.productName),
  ]);
  saveProductsToStorage([...allProducts]);
  updateProductDatalist();
  saveInvoiceNumber(invoiceNumber);

  const templateContent = await fetch(templateUrl).then((res) =>
    res.arrayBuffer()
  );
  console.log("🚀 ~ generateDocx ~ templateContent:", templateContent);
  const zip = new PizZip(templateContent);
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

  doc.render({
    supplier,
    buyer,
    invoiceNumber,
    invoiceDate: invoiceFormattedDate,
    items: rows,
    length: rows.length,
    total,
    totalWithWords: sumToWordsUA(total),
  });

  const blob = doc.getZip().generate({
    type: "blob",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

  const finalFileName = `${fileName}_${invoiceDateShortString}_${invoiceNumber}.docx`;
  await saveToDirectory(blob, finalFileName);
}
