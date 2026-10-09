import {ref} from "vue";
import {pendingRow} from "../domain/placeholders.js";

export function usePromised(released = () => {}) {
    const pending = ref([]);
    const linked = new Map();

    function promise(row) {
        const placeholder = pendingRow("pending:", row);
        pending.value = [...pending.value, placeholder];
        return placeholder;
    }

    function drop(placeholder) {
        pending.value = pending.value.filter((p) => p.ref !== placeholder.ref);
        released(placeholder);
    }

    function change(placeholder, fields) {
        pending.value = pending.value.map((p) => (p.ref === placeholder.ref ? {...p, ...fields} : p));
    }

    function keep(listed) {
        const listedRefs = new Set(listed.map((row) => row.ref));
        const replaced = pending.value.filter((p) => !listedRefs.has(p.ref));
        if (!replaced.length) return;
        replaced.forEach(released);
        pending.value = pending.value.filter((p) => listedRefs.has(p.ref));
    }

    const link = (real, placeholder) => linked.set(real, placeholder);
    const keyOf = (row) => linked.get(row.ref) || row.ref;
    return {pending, promise, drop, change, keep, link, keyOf};
}
