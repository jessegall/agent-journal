import {api} from "../api/client.js";

let marking = false;

export async function markSeen(type, numbers) {
    if (marking || !numbers.length) return;
    marking = true;
    try {
        await api.readAll(type, numbers);
    } finally {
        marking = false;
    }
}
