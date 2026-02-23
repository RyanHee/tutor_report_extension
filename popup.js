const SHEET_ID = "1Zr6dXyauufAz0fXvSjZXvDrj7ap7sVUWh1lqbjU0rRU";
const RANGE = "Sheet1!A1:K1000";

let rowsData = [];
let unpaidRows = [];

async function getToken() {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, token => {
      if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
      else resolve(token);
    });
  });
}

async function fetchSheet() {
  const token = await getToken();

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  const data = await res.json();
  rowsData = data.values;
  populateDropdown();
}

function populateDropdown() {
  const headers = rowsData[0];
  const studentIndex = headers.indexOf("Student");

  const students = new Set();

  for (let i = 1; i < rowsData.length; i++) {
    students.add(rowsData[i][studentIndex]);
  }

  const dropdown = document.getElementById("studentDropdown");
  dropdown.innerHTML = "";

  students.forEach(s => {
    const option = document.createElement("option");
    option.value = s;
    option.textContent = s;
    dropdown.appendChild(option);
  });
}

document.getElementById("generate").addEventListener("click", () => {
  const student = document.getElementById("studentDropdown").value;

  const headers = rowsData[0];
  const index = name => headers.indexOf(name);

  unpaidRows = [];
  let totalHours = 0;
  let totalMoney = 0;
  let output = "";

  for (let i = 1; i < rowsData.length; i++) {
    const row = rowsData[i];

    if (row[index("Student")] === student &&
        row[index("Paid?")] === "0") {

      unpaidRows.push(i + 1);

      const hours = parseFloat(row[index("Hours")]);
      const earning = parseFloat(row[index("Earning")]);

      totalHours += hours;
      totalMoney += earning;


      const date = new Date(row[index("Date")]);
      const formattedDate = `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;

      function formatTime(t) {
        let [h, m] = t.split(":");
        h = parseInt(h);
        const ampm = h >= 12 ? "pm" : "am";
        h = h % 12 || 12;
        return `${h}${m === "00" ? "" : ":" + m}${ampm}`;
      }

      const start = formatTime(row[index("Start time")]);
      const end = formatTime(row[index("End time")]);

      output += `${start}-${end} ${formattedDate}, `;
      // output += `${row[index("Date")]} | ${row[index("Start time")]} - ${row[index("End time")]} | ${hours} hrs | $${earning}\n`;
    }
  }

  output += "\n------------------\n";
  output += `Total Hours: ${totalHours}\n`;
  output += `Total Money: $${totalMoney}`;

  document.getElementById("output").value = output;
});

document.getElementById("markPaid").addEventListener("click", async () => {
  if (unpaidRows.length === 0) return alert("No unpaid sessions.");

  const token = await getToken();
  const headers = rowsData[0];
  const paidIndex = headers.indexOf("Paid?");

  const colLetter = String.fromCharCode(65 + paidIndex);

  const requests = unpaidRows.map(rowNum => ({
    range: `Sheet1!${colLetter}${rowNum}`,
    values: [[1]]
  }));

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values:batchUpdate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        valueInputOption: "RAW",
        data: requests
      })
    }
  );

  alert("Marked as paid.");
  fetchSheet();
});

document.getElementById("copy").addEventListener("click", () => {
  const textarea = document.getElementById("output");
  textarea.select();
  document.execCommand("copy");
});

fetchSheet();