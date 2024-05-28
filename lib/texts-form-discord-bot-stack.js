import * as cdk from 'aws-cdk-lib';
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as dotenv from "dotenv";

dotenv.config();

export class TextsFormDiscordBotStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Define GoogleSheetUpdater Lambda function
    const googleSheetUpdater = new lambda.DockerImageFunction(
      this,
      "GoogleSheetUpdater",
      {
        code: lambda.DockerImageCode.fromImageAsset("./packages/google-sheet-updater"),
        memorySize: 1024,
        timeout: cdk.Duration.seconds(10),
        architecture: lambda.Architecture.ARM_64,
        environment: {
          GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
          GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID,
        },
      }
    );

    // Define DiscordInteractionHandler Lambda function
    const discordInteractionHandler = new lambda.DockerImageFunction(
      this,
      "DiscordInteractionHandler",
      {
        code: lambda.DockerImageCode.fromImageAsset("./packages/discord-interaction-handler"),
        memorySize: 1024,
        timeout: cdk.Duration.seconds(10),
        architecture: lambda.Architecture.ARM_64,
        environment: {
          DISCORD_PUBLIC_KEY: process.env.DISCORD_PUBLIC_KEY,
          GOOGLE_SHEET_UPDATER_ARN: googleSheetUpdater.functionArn,
        },
      }
    );

    // Add endpoint for DiscordInteractionHandler
    const httpApi = new apigatewayv2.HttpApi(this, 'HttpApi', {
      apiName: 'DiscordInteractionHandlerApi',
    });

    httpApi.addRoutes({
      path: "/add-text",
      methods: [apigatewayv2.HttpMethod.POST],
      integration: new integrations.HttpLambdaIntegration("DiscordInteractionHandlerIntegration", discordInteractionHandler, {
        payloadFormatVersion: apigatewayv2.PayloadFormatVersion.VERSION_1_0,
      }),
    });

    new cdk.CfnOutput(this, "ApiEndpoint", {
      value: httpApi.apiEndpoint,
    });

    // DiscordInteractionHandler to invoke GoogleSheetUpdater
    discordInteractionHandler.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "lambda:InvokeFunction"
      ],
      resources: [
        googleSheetUpdater.functionArn
      ]
    }));
  }
}