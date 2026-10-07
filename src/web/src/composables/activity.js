import {computed} from "vue";
import {meta} from "../domain/spec.js";
import {useToggledSet} from "./toggledSet.js";

const WORDS = {created: "New", updated: "Updated", deleted: "Deleted", linked: "Linked", commented: "Commented on", reopened: "Reopened"};
const BUSY = new Set(["agent", "nudge"]);
const SHOWN = 80;

const minute = (e) => Math.floor(e.at / 60);

export const counted = (events) =>
    Object.entries(Object.groupBy(events, (e) => e.type))
        .map(([type, of]) => `${of.length} ${type === "agent" ? "agent update" : type}${of.length === 1 ? "" : "s"}`)
        .join(", ");

export function useActivity(events, find) {
    const logged = (e) => (e.type === "notification" && e.action === "created" && find(`notification:${e.n}`)) || {data: {}};
    const announced = (e) => logged(e).data.kind === "update";
    const raised = (e) => e.action === "raised";
    const written = (e) => logged(e).data.kind === "activity";
    const tone = (e) => (raised(e) ? e.data.tone : written(e) && logged(e).data.tone);
    const {members: opened, toggle: unfold} = useToggledSet();
    const rows = computed(() => {
        const list = [];
        for (const e of [...events.value].reverse().filter((e) => e.action !== "stamped")) {
            const last = list[list.length - 1];
            if (!BUSY.has(e.type)) list.push({key: e.id, event: e});
            else if (last && last.events && last.minute === minute(e)) last.events.push(e);
            else list.push({minute: minute(e), events: [e]});
        }
        return list.slice(0, SHOWN).map((row) => (row.events ? {...row, key: `fold-${row.events[row.events.length - 1].id}`} : row));
    });
    const items = computed(() =>
        rows.value.flatMap((row) =>
            row.events
                ? [
                      {key: row.key, fold: row},
                      ...(opened.value.has(row.key) ? row.events.map((e) => ({key: e.id, event: e, nested: true})) : []),
                  ]
                : [row]
        )
    );
    const {members: toggled, toggle: flip} = useToggledSet();
    const newsworthy = (e) => raised(e) || e.type === "notification";
    const opensAtFirst = (e) => newsworthy(e) && !(raised(e) && e.data.collapsed);
    const expanded = (e) => opensAtFirst(e) !== toggled.value.has(e.id);
    const toggle = (e) => flip(e.id);
    const did = (e) => (e.action === "updated" && e.data && e.data.section ? "sectioned" : e.action);
    function heading(e) {
        if (raised(e)) return e.data.title;
        if (announced(e)) return "Journal updated";
        if (written(e)) return logged(e).title;
        if (logged(e).data.label) return logged(e).data.label;
        const labels = meta(e.type).event_labels || {};
        const own = labels[`${e.action}.${e.data?.by}`] || labels[did(e)];
        if (own) return own;
        if (e.action === "completed") return `${meta(e.type).title} closed`;
        return `${WORDS[e.action]} ${meta(e.type).title.toLowerCase()}`;
    }
    const hooked = (e) => [e.data?.hook, e.data?.tool].filter(Boolean).join(" ");
    const title = (e) => (raised(e) ? e.data.brief : written(e) ? logged(e).brief : hooked(e) || (find(`${e.type}:${e.n}`) || {}).title) || "";
    const who = (e) => (raised(e) ? e.data.plugin : written(e) ? logged(e).data.plugin : e.actor[0].toUpperCase() + e.actor.slice(1));
    return {items, announced, tone, unfold, expanded, toggle, heading, title, who};
}
