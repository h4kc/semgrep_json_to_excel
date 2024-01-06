const fs = require("fs");
const xlsx = require("xlsx");

const filePath = "./smgrep-results.json";

fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the file:", err);
    return;
  }

  // Parse the JSON data
  try {
    const jsonData = JSON.parse(data);
    const parsed_results = jsonData.results.map((e) => {
      return {
        check_id: e.check_id,
        file: e.path,
        severity: e.extra.severity,
        impact: e.extra.metadata.impact,
        message: e.extra.message,
      };
    });

    console.log(parsed_results);

    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(parsed_results);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Semgrep Results");
    const outputFileName = "semgrep-results.xlsx";
    xlsx.writeFile(workbook, outputFileName);
    console.log(`Excel file "${outputFileName}" created successfully.`);
  } catch (jsonError) {
    console.error("Error parsing JSON:", jsonError);
  }
});
