import {computed} from "vue";
import {useScope} from "../composables/scope.js";
import {peek, peekChip, peekRef, peekThere, route} from "../route.js";

export function useTurnLinks() {
    const scope = useScope();
    const env = computed(() => scope.env || route.value.env);
    const open = (type, n, comment = 0) => (scope.env ? peekThere(scope.env, type, n, comment) : peek(type, n, comment));
    const openRef = (ref) => (ref.includes("@") ? peekRef(ref) : open(ref.split(":")[0], Number(ref.split(":")[1])));

    function openChip(e) {
        if (!scope.env) return peekChip(e);
        const chip = e.target.closest("[data-peek]");
        if (!chip) return;
        e.preventDefault();
        e.stopPropagation();
        openRef(chip.dataset.peek);
    }

    return {scope, env, open, openRef, openChip};
}
