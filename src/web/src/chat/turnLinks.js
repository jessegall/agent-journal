import {computed} from "vue";
import {useScope} from "../composables/scope.js";
import {chipTarget, peek, peekChip, peekRef, peekThere, route} from "../route.js";

export function useTurnLinks() {
    const scope = useScope();
    const env = computed(() => scope.env || route.value.env);
    const open = (type, n, comment = 0) => (scope.env ? peekThere(scope.env, type, n, comment) : peek(type, n, comment));
    const openRef = (ref) => (ref.includes("@") ? peekRef(ref) : open(ref.split(":")[0], Number(ref.split(":")[1])));

    function openChip(event) {
        if (!scope.env) return peekChip(event);
        const target = chipTarget(event);
        if (target) openRef(target);
    }

    return {scope, env, open, openRef, openChip};
}
