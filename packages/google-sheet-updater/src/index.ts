import * as lambda from 'aws-lambda';
import { RowData } from './row-data';
import { appendToGoogleSheet } from './google-sheets';

export const handler = async (event: RowData): Promise<lambda.APIGatewayProxyResult> => {
    await appendToGoogleSheet(event);
    return {
        statusCode: 200,
        body: "Ok",
    }
}