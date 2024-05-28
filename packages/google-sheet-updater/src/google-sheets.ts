import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from 'google-auth-library';
import type { RowData } from "./row-data";
import { getGooglePrivateKey, getGoogleServiceAccountEmail, getGoogleSheetId } from "./env";

const SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
]

const GOOGLE_JWT = new JWT({
    email: getGoogleServiceAccountEmail(),
    key: getGooglePrivateKey(),
    scopes: SCOPES,
});

const GOOGLE_SHEETS_DOC = new GoogleSpreadsheet(getGoogleSheetId(), GOOGLE_JWT);

export async function appendToGoogleSheet(row: RowData) {
    console.log("Add row to Google sheet");
    await GOOGLE_SHEETS_DOC.loadInfo();
    const sheet = GOOGLE_SHEETS_DOC.sheetsByIndex[0];

    await sheet.addRow(
        {
            Title: row.title,
            "Author(s)": row.author, 
            ...(row.notes ? { "Notes": row.notes } : undefined),
            ...(row.links ? { "Links": row.links } : undefined),
            ...(row.addedBy ? { "Added By": row.addedBy } : undefined),
        }
    );
}
