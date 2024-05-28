import { REST, Routes } from "discord.js";

const ADD_TEXT_SLASH_COMMAND = "add-text";

const commands = [
    {
        name: ADD_TEXT_SLASH_COMMAND,
        description: "Adds a text to the spreadsheet",
    }
];

const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

(async () => {
    try {
        console.log("Registering slash commands");

        await rest.put(
            Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID!, process.env.DISCORD_GUILD_ID!),
            { body: commands }
        );

        console.log("Slash commands registered succesfully");
    } catch(error) {
        console.error("An error occured", error);
    }
})();