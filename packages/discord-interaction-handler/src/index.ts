import * as lambda from 'aws-lambda';
import { Lambda } from "aws-sdk";
import { verifyKey, InteractionType, InteractionResponseType } from "discord-interactions";
import { ADD_TEXT_SLASH_COMMAND } from './slash-commands';
import { MODAL_CUSTOM_ID, buildModal, buildReply, getFormDataFromComponents } from './discord-form';

export const handler = async (event: lambda.APIGatewayEvent, context: lambda.Context): Promise<lambda.APIGatewayProxyResult> => {
    if(event.httpMethod === "POST" && event.body) {

        const isVerified = keyIsVerified(event.body, event.headers);

        if (!isVerified) {
            console.log("Not verified");
            return {
                statusCode: 401,
                body: "Not verified",
            }
        }

        console.log("Verifed");

        const body = JSON.parse(event.body);

        if(body.type === InteractionType.PING) {
            console.log("Sending PONG");
            return {
                statusCode: 200,
                body: JSON.stringify({
                    type: InteractionResponseType.PONG
                }),
                headers: {
                    "Content-Type": "application/json",
                }
            };
        }

        if(body.type === InteractionType.APPLICATION_COMMAND && body.data.name === ADD_TEXT_SLASH_COMMAND) {
            console.log("sending response to /add-text");
            const modal = buildModal();
            return {
                statusCode: 200,
                body: modal,
                headers: {
                    "Content-Type": "application/json",
                }
            }
        }

        if(body.type === InteractionType.MODAL_SUBMIT && body.data.custom_id === MODAL_CUSTOM_ID) {
            console.log("handling modal submission");

            const formData = getFormDataFromComponents(body.data.components);

            const googleSheetUpdaterParams: Lambda.InvocationRequest = {
                FunctionName: process.env.GOOGLE_SHEET_UPDATER_ARN!,
                InvocationType: "RequestResponse",
                Payload: JSON.stringify({...formData, addedBy: body?.member?.nick }),
            }

            const invocationResult = await  (new Lambda()).invoke(googleSheetUpdaterParams).promise();
            console.log("Invocation result", invocationResult);

            if(invocationResult.FunctionError) {
                return {
                    statusCode: 500,
                    body: "Server error",
                }
            }

            console.log("Replying in Discord");
            return {
                statusCode: 200,
                body: JSON.stringify({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        content: buildReply(formData)
                    }
                }),
                headers: {
                    "Content-Type": "application/json",
                }
            };
        }
    }

    return {
        statusCode: 404,
        body: "Not found",
    }
};

function keyIsVerified(body: string, headers: Record<string, string| undefined>): boolean {
    const timestamp = headers["x-signature-timestamp"]!;
    const signature = headers["x-signature-ed25519"]!;
    const publicKey = process.env.DISCORD_PUBLIC_KEY!;

    return verifyKey(body, signature, timestamp, publicKey);
}