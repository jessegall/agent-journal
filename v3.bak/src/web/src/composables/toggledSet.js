import {ref} from "vue";

export function useToggledSet() {
    const members = ref(new Set());

    function toggle(key) {
        const next = new Set(members.value);
        next.has(key) ? next.delete(key) : next.add(key);
        members.value = next;
    }

    return {members, toggle};
}
