const SHEET_ID = "YOUR_SHEET_ID";
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

document.getElementById("generate").addEventListener("click", async () => {
  const student = document.getElementById("student").value;

  const response = await fetch(CSV_URL);
  const text = await response.text();

  const rows = text.split("\n").map(r => r.split(","));
  const headers = rows[0];

  const studentIndex = headers.indexOf("Student");
  const paidIndex = headers.indexOf("Paid?");
  const hoursIndex = headers.indexOf("Hours");
  const earningIndex = headers.indexOf("Earning");
  const dateIndex = headers.indexOf("Date");
  const startIndex = headers.indexOf("Start time");
  const endIndex = headers.indexOf("End time");

  let totalHours = 0;
  let totalMoney = 0;
  let output = "";

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];

    if (row[studentIndex] === student && row[paidIndex] === "0") {
      totalHours += parseFloat(row[hoursIndex]);
      totalMoney += parseFloat(row[earningIndex]);

      output += `${row[dateIndex]} | ${row[startIndex]} - ${row[endIndex]} | ${row[hoursIndex]} hrs | $${row[earningIndex]}\n`;
    }
  }

  output += "\n------------------\n";
  output += `Total Hours: ${totalHours}\n`;
  output += `Total Money: $${totalMoney}`;

  document.getElementById("output").value = output;
});

document.getElementById("copy").addEventListener("click", () => {
  const textarea = document.getElementById("output");
  textarea.select();
  document.execCommand("copy");
});