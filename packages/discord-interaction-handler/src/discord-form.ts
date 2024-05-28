
import type { ModalFormData } from "./modal-form-data";
import { InteractionResponseType, MessageComponentTypes, TextStyleTypes } from "discord-interactions";

export const MODAL_CUSTOM_ID = "add-text-form";

const TITLE_CUSTOM_ID = "text-title";
const AUTHOR_CUSTOM_ID = "text-author";
const NOTE_CUSTOM_ID = "text-notes";
const LINKS_CUSTOM_ID = "text-links";

export function buildReply(formData: ModalFormData): string {
    return `**Title:** ${formData.title}\n**Author(s):** ${formData.author}`
         + (formData.notes ? `\n**Notes:** ${formData.notes}` : "") 
         + (formData.links ? `\n**Links:** ${formData.links}` : "");
}

export function buildModal(): string {
    return JSON.stringify({
        type: InteractionResponseType.MODAL,
        data: {
            custom_id: MODAL_CUSTOM_ID,
            title: "Add a text",
            components: [
                {
                    type: MessageComponentTypes.ACTION_ROW,
                    components: [
                        {
                            type: MessageComponentTypes.INPUT_TEXT,
                            custom_id: TITLE_CUSTOM_ID,
                            style: TextStyleTypes.SHORT,
                            label: "Name",
                        },
                    ]
                },
                {
                    type: MessageComponentTypes.ACTION_ROW,
                    components: [
                        {
                            type: MessageComponentTypes.INPUT_TEXT,
                            custom_id: AUTHOR_CUSTOM_ID,
                            style: TextStyleTypes.SHORT,
                            label: "Author(s)",
                        },
                    ]
                },
                {
                    type: MessageComponentTypes.ACTION_ROW,
                    components: [
                        {
                            type: MessageComponentTypes.INPUT_TEXT,
                            custom_id: NOTE_CUSTOM_ID,
                            style: TextStyleTypes.PARAGRAPH,
                            label: "Author(s)",
                            required: false,
                        },
                    ]
                },
                {
                    type: MessageComponentTypes.ACTION_ROW,
                    components: [
                        {
                            type: MessageComponentTypes.INPUT_TEXT,
                            custom_id: LINKS_CUSTOM_ID,
                            style: TextStyleTypes.PARAGRAPH,
                            label: "Links",
                            required: false,
                        }
                    ]
                }
            ]
        }
      })
}

export function getFormDataFromComponents(components: any): ModalFormData {
    const title = components[0].components.find((c: any) => c.custom_id === TITLE_CUSTOM_ID).value as string;
    const author = components[1].components.find((c: any) => c.custom_id === AUTHOR_CUSTOM_ID).value as string;
    const notes = components[2].components.find((c: any) => c.custom_id === NOTE_CUSTOM_ID).value as string;
    const links = components[3].components.find((c: any) => c.custom_id === LINKS_CUSTOM_ID).value as string;

    return {
        title,
        author,
        notes: notes.length > 0 ? notes : undefined,
        links: links.length > 0 ? links : undefined,
    }
}