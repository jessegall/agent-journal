import {inject, shallowReactive} from "vue";
import {WINDOW_CONTEXT} from "../../kit/windowContextKey.js";
import {cliOf} from "../domain/modelNames.js";
import {render} from "./index.js";

const sources = new WeakMap();

function sourceFor(window) {
    if (sources.has(window)) return sources.get(window);
    const rows = shallowReactive(new Map());
    const pending = new Map();
    const followed = new Set();
    const keyOf = (table, id) => `${table}:${id}`;

    function load(table, id) {
        const key = keyOf(table, id);
        const request = window.read(`${cliOf(table)} show ${id}`);
        pending.set(key, request);
        request.then((answer) => {
            if (pending.get(key) !== request) return;
            pending.delete(key);
            rows.set(key, answer.ok ? {...answer.value, table} : null);
        });
    }

    function follow(table) {
        if (followed.has(table)) return;
        followed.add(table);
        window.follow([`${cliOf(table).replace(/-/g, "_")}.*`], (event) => {
            const prefix = `${table}:`;
            for (const key of rows.keys()) {
                if (!key.startsWith(prefix)) continue;
                const id = Number(key.slice(prefix.length));
                if (!event.row_id || event.row_id === id) load(table, id);
            }
        });
    }

    function row(table, id) {
        follow(table);
        const key = keyOf(table, id);
        if (!rows.has(key) && !pending.has(key)) load(table, id);
        return rows.get(key);
    }

    const source = {id: Symbol("window text rows"), row};
    sources.set(window, source);
    return source;
}

export function useTextRender() {
    const window = inject(WINDOW_CONTEXT, null);
    const source = window ? sourceFor(window) : null;
    return (text, options = {}) => render(text, {...options, env: window?.environment ?? "", source: source?.id, row: source?.row});
}
