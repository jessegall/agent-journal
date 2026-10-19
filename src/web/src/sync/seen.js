import {api} from "../api/client.js";

let marking = false;

// The user's own reading of the agent's messages: each one read in the chat is marked read, a few at a time.
export async function markSeen(ids) {
    if (marking || !ids.length) return;
    marking = true;
    try {
        await api.readMessages(ids);
    } finally {
        marking = false;
    }
}
