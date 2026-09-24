import {ref} from "vue";

let made = 0;

export function usePromised(released = () => {}) {
    const pending = ref([]);
    const linked = new Map();

    function promise(row) {
        made += 1;
        const placeholder = {
            ref: `pending:${made}`,
            n: 0,
            title: "",
            abstract: "",
            brief: "",
            refs: [],
            seen: ["user"],
            sections: [],
            data: {},
            created: Date.now() / 1000,
            updated: 0,
            deleted: 0,
            completed: 0,
            who: "user",
            pending: true,
            ...row,
        };
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
        const shown = new Set(listed.map((row) => row.ref));
        const replaced = pending.value.filter((p) => !shown.has(p.ref));
        if (!replaced.length) return;
        replaced.forEach(released);
        pending.value = pending.value.filter((p) => shown.has(p.ref));
    }

    const link = (real, placeholder) => linked.set(real, placeholder);
    const keyOf = (row) => linked.get(row.ref) || row.ref;
    return {pending, promise, drop, change, keep, link, keyOf};
}
