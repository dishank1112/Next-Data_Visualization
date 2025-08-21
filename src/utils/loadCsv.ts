import Papa, { ParseResult } from "papaparse";

export async function loadCsv(filePath: string) {
  const response = await fetch(filePath);
  const text = await response.text();
  return new Promise<any[]>((resolve) => {
    Papa.parse(text, {
  header: true,
  complete: (result: ParseResult<any>) => {
    //console.log("PapaParse result:", result);
    resolve(result.data);
  },
});
  });
}
