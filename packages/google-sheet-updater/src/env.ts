
export function getGoogleServiceAccountEmail(): string {
    return process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!
}

export function getGooglePrivateKey(): string {
    // For some reason, pulling the key from the lambda environment messes up the PEM format
    return process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/gm, "\n");
}

export function getGoogleSheetId(): string {
    return process.env.GOOGLE_SHEET_ID!;
}