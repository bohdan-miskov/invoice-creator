export function sumToWordsUA(amount) {
  const unitsFeminine = [
    "",
    "одна",
    "дві",
    "три",
    "чотири",
    "п’ять",
    "шість",
    "сім",
    "вісім",
    "дев’ять",
  ];
  const unitsMasculine = [
    "",
    "один",
    "два",
    "три",
    "чотири",
    "п’ять",
    "шість",
    "сім",
    "вісім",
    "дев’ять",
  ];
  const teens = [
    "десять",
    "одинадцять",
    "дванадцять",
    "тринадцять",
    "чотирнадцять",
    "п’ятнадцять",
    "шістнадцять",
    "сімнадцять",
    "вісімнадцять",
    "дев’ятнадцять",
  ];
  const tens = [
    "",
    "",
    "двадцять",
    "тридцять",
    "сорок",
    "п’ятдесят",
    "шістдесят",
    "сімдесят",
    "вісімдесят",
    "дев’яносто",
  ];
  const hundreds = [
    "",
    "сто",
    "двісті",
    "триста",
    "чотириста",
    "п’ятсот",
    "шістсот",
    "сімсот",
    "вісімсот",
    "дев’ятсот",
  ];

  function getWordForm(number, forms) {
    const lastDigit = number % 10;
    const lastTwoDigits = number % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return forms[2];
    if (lastDigit === 1) return forms[0];
    if (lastDigit >= 2 && lastDigit <= 4) return forms[1];
    return forms[2];
  }

  function groupToWords(n, gender = "masculine") {
    if (n === 0) return "нуль";

    let words = "";

    if (n >= 100) {
      const h = Math.floor(n / 100);
      words += hundreds[h] + " ";
      n %= 100;
    }

    if (n >= 20) {
      const t = Math.floor(n / 10);
      words += tens[t] + " ";
      n %= 10;
    }

    if (n >= 10) {
      words += teens[n - 10] + " ";
      n = 0;
    }

    if (n > 0) {
      const units = gender === "feminine" ? unitsFeminine : unitsMasculine;
      words += units[n] + " ";
    }

    return words.trim();
  }

  function numberToWords(n) {
    if (n === 0) return "нуль";

    const millions = Math.floor(n / 1_000_000);
    const thousands = Math.floor((n % 1_000_000) / 1_000);
    const rest = n % 1_000;

    let result = "";

    if (millions > 0) {
      result +=
        groupToWords(millions) +
        " " +
        getWordForm(millions, ["мільйон", "мільйони", "мільйонів"]) +
        " ";
    }

    if (thousands > 0) {
      result +=
        groupToWords(thousands, "feminine") +
        " " +
        getWordForm(thousands, ["тисяча", "тисячі", "тисяч"]) +
        " ";
    }

    if (rest > 0) {
      result += groupToWords(rest, "feminine") + " ";
    }

    return result.trim();
  }

  const hryvnias = Math.floor(amount);
  const kopiyky = Math.round((amount - hryvnias) * 100);

  const hryvniaWords = numberToWords(hryvnias);
  const hryvniaForm = getWordForm(hryvnias, ["гривня", "гривні", "гривень"]);

  const kopiykyWords = groupToWords(kopiyky, "feminine");
  const kopiykyForm = getWordForm(kopiyky, ["копійка", "копійки", "копійок"]);

  return `${
    hryvniaWords[0].toUpperCase() + hryvniaWords.slice(1)
  } ${hryvniaForm} ${kopiykyWords} ${kopiykyForm}`;
}
