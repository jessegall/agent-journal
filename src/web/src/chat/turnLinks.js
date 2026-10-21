import {computed} from "vue";
import {useScope} from "../composables/scope.js";
import {openFiles} from "../platform/view.js";
import {chipTarget, peek, peekChip, peekRef, peekThere, route, showFile} from "../route.js";

export function useTurnLinks() {
    const scope = useScope();
    const env = computed(() => scope.env || route.value.env);
    const open = (type, n, comment = 0) => (scope.env ? peekThere(scope.env, type, n, comment) : peek(type, n, comment));
    const openRef = (ref) => (ref.includes("@") ? peekRef(ref) : open(ref.split(":")[0], Number(ref.split(":")[1])));

    function openChip(event) {
        const attached = event.target.closest("[data-attached]");
        if (attached) {
            event.preventDefault();
            return openFiles([{name: attached.dataset.attached, url: attached.getAttribute("href")}], 0);
        }
        const file = event.target.closest("[data-file]");
        if (file) {
            event.preventDefault();
            return showFile(file.dataset.file, 0, scope.env);
        }
        if (!scope.env) return peekChip(event);
        const target = chipTarget(event);
        if (target) openRef(target);
    }

    return {scope, env, open, openRef, openChip};
}
