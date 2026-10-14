import {computed, ref} from "vue";
import {api} from "../api/client.js";

export const me = ref(null);

export const ownsJournal = computed(() => !me.value || me.value.owner);

export async function loadMe() {
    try {
        me.value = await api.hostingMe();
    } catch (e) {}
}
