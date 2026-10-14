import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {writerOf} from "../domain/members.js";

export const people = ref({owner: null, members: []});

const names = computed(() => Object.fromEntries(people.value.members.map((member) => [member.id, member.name])));

export const writerName = (data) => writerOf(data, names.value);

export async function loadPeople() {
    try {
        people.value = await api.members();
    } catch (e) {}
}
