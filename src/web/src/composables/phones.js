import {ref} from "vue";
import {api} from "../api/client.js";

// The phone paired with the journal now, as the desk last read it: one at a time.
export const connectedPhones = ref([]);

export async function loadPhones() {
    connectedPhones.value = (await api.phones()).phones;
}

export const phoneTime = (at) =>
    new Date(at).toLocaleString(undefined, {day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"});
