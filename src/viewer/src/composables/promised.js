import {ref} from "vue";
import {pendingRow} from "../domain/placeholders.js";

// Rows drawn at once while the journal writes the real ones, each kept until a listed row answers it.
export function usePromised(released = () => {}) {
    const pending = ref([]);
    const linked = new Map();

    function promise(table, same, row = {}) {
        const placeholder = pendingRow(table, same, row);
        pending.value = [...pending.value, placeholder];
        return placeholder;
    }

    function drop(placeholder) {
        pending.value = pending.value.filter((p) => p.key !== placeholder.key);
        released(placeholder);
    }

    function change(placeholder, fields) {
        pending.value = pending.value.map((p) => (p.key === placeholder.key ? {...p, ...fields} : p));
    }

    function keep(listed) {
        const listedKeys = new Set(listed.map((row) => row.key));
        const replaced = pending.value.filter((p) => !listedKeys.has(p.key));
        if (!replaced.length) return;
        replaced.forEach(released);
        pending.value = pending.value.filter((p) => listedKeys.has(p.key));
    }

    const link = (real, placeholder) => linked.set(real, placeholder);
    const keyOf = (row) => linked.get(row.key) || row.key;
    return {pending, promise, drop, change, keep, link, keyOf};
}
