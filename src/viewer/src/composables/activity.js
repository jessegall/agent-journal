import {computed} from "vue";
import {meta} from "../domain/tables.js";
import {atOf, closes, isRowChange, known, tableOf, whoOf} from "../domain/entries.js";
import {titleOf} from "../domain/row.js";
import {useToggledSet} from "./toggledSet.js";

const WORDS = {created: "New", updated: "Updated", deleted: "Deleted"};
const BUSY = new Set(["agents", "nudges"]);
const SHOWN = 80;

const minute = (e) => Math.floor(atOf(e) / 60);

export const counted = (entries) =>
    Object.entries(Object.groupBy(entries, tableOf))
        .map(([table, of]) => `${of.length} ${table === "agents" ? "agent update" : meta(table).title.toLowerCase()}${of.length === 1 ? "" : "s"}`)
        .join(", ");

// The timeline as the activity rail lists it, newest first: a row's change on a line of its own, the agents' hooks and the
// lines typed to them folded by the minute.
export function useActivity(entries, find) {
    const {members: opened, toggle: unfold} = useToggledSet();
    const rows = computed(() => {
        const list = [];
        for (const e of [...entries.value].reverse().filter(known)) {
            const last = list[list.length - 1];
            if (!BUSY.has(tableOf(e))) list.push({key: e.id, entry: e});
            else if (last && last.entries && last.minute === minute(e)) last.entries.push(e);
            else list.push({minute: minute(e), entries: [e]});
        }
        return list.slice(0, SHOWN).map((row) => (row.entries ? {...row, key: `fold-${row.entries[row.entries.length - 1].id}`} : row));
    });
    const items = computed(() =>
        rows.value.flatMap((row) =>
            row.entries
                ? [{key: row.key, fold: row}, ...(opened.value.has(row.key) ? row.entries.map((e) => ({key: e.id, entry: e, nested: true})) : [])]
                : [row]
        )
    );
    const {members: toggled, toggle: flip} = useToggledSet();
    const expanded = (e) => toggled.value.has(e.id);
    const toggle = (e) => flip(e.id);
    function heading(e) {
        if (e.entry_type === "nudge") return "Agent instruction";
        if (!isRowChange(e)) return `Agent ${e.entry_type}`;
        const kind = meta(e.data.table);
        if (closes(e)) return `${kind.title} closed`;
        return `${WORDS[e.entry_type]} ${kind.title.toLowerCase()}`;
    }
    const title = (e) => (e.entry_type === "nudge" ? e.data.line : isRowChange(e) ? e.data.title || titleOf(find(`${e.data.table}:${e.data.id}`) || {}) : e.data.tool_name) || "";
    const who = (e) => whoOf(e).charAt(0).toUpperCase() + whoOf(e).slice(1);
    return {items, expanded, toggle, heading, title, who, unfold};
}
