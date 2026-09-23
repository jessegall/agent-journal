<script setup>
import TextDisplay from "../kit/TextDisplay.vue";
import {computed, onMounted, ref} from "vue";
import {peek} from "../route.js";
import {byRef} from "../domain/records.js";
import {age} from "../format/time.js";
import {meta, store, word} from "../state/store.js";

const WORDS = {created: "New", updated: "Updated", deleted: "Deleted", linked: "Linked", commented: "Commented on", reopened: "Reopened"};
const settled = ref(false);
onMounted(() => setTimeout(() => (settled.value = true), 400));
const logged = (e) => (e.type === "notification" && e.action === "created" && byRef(`notification:${e.n}`)) || {data: {}};
const announced = (e) => logged(e).data.kind === "update";
const raised = (e) => e.action === "raised";
const written = (e) => logged(e).data.kind === "activity";
const tone = (e) => (raised(e) ? e.data.tone : written(e) && logged(e).data.tone);
const BUSY = new Set(["agent", "nudge"]);
const opened = ref(new Set());
const minute = (e) => Math.floor(e.at / 60);
const rows = computed(() => {
    const list = [];
    for (const e of [...store.events].reverse().filter((e) => e.action !== "stamped")) {
        const last = list[list.length - 1];
        if (!BUSY.has(e.type)) list.push({key: e.id, event: e});
        else if (last && last.events && last.minute === minute(e)) last.events.push(e);
        else list.push({minute: minute(e), events: [e]});
    }
    return list.slice(0, 80).map((row) => (row.events ? {...row, key: `fold-${row.events[row.events.length - 1].id}`} : row));
});
const counted = (events) =>
    Object.entries(Object.groupBy(events, (e) => e.type))
        .map(([type, of]) => `${of.length} ${type === "agent" ? "agent update" : type}${of.length === 1 ? "" : "s"}`)
        .join(", ");
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
const toggled = ref(new Set());
const newsworthy = (e) => raised(e) || e.type === "notification";
const expanded = (e) => newsworthy(e) !== toggled.value.has(e.id);
function toggle(e) {
    const next = new Set(toggled.value);
    next.has(e.id) ? next.delete(e.id) : next.add(e.id);
    toggled.value = next;
}
function unfold(key) {
    const next = new Set(opened.value);
    next.has(key) ? next.delete(key) : next.add(key);
    opened.value = next;
}
const did = (e) => (e.action === "updated" && e.data && e.data.section ? "sectioned" : e.action);
function heading(e) {
    if (raised(e)) return e.data.title;
    if (announced(e)) return "Journal updated";
    if (written(e)) return logged(e).title;
    if (logged(e).data.label) return logged(e).data.label;
    const labels = meta(e.type).event_labels || {};
    const own = labels[`${e.action}.${e.data?.by}`] || labels[did(e)];
    if (own) return own;
    if (e.action === "completed") return `${meta(e.type).title} ${word(e.type, "complete")}`;
    return `${WORDS[e.action]} ${meta(e.type).title.toLowerCase()}`;
}
const hooked = (e) => [e.data?.hook, e.data?.tool].filter(Boolean).join(" ");
const title = (e) => (raised(e) ? e.data.brief : written(e) ? logged(e).brief : hooked(e) || (byRef(`${e.type}:${e.n}`) || {}).title) || "";
const who = (e) => (raised(e) ? e.data.plugin : written(e) ? logged(e).data.plugin : e.actor[0].toUpperCase() + e.actor.slice(1));
</script>

<template>
    <TransitionGroup tag="div" class="activity-list" :name="settled ? 'act' : ''">
        <template v-for="item in items" :key="item.key">
            <template v-if="item.fold">
                <button type="button" class="activity-row activity-fold" @click="unfold(item.key)">
                    <span class="activity-text">{{ counted(item.fold.events) }}</span>
                    <span class="activity-age">{{ age(item.fold.events[0].at) || "just now" }}</span>
                </button>
            </template>
            <template v-else>
                <div
                    :class="[
                        'activity-row',
                        'activity-link',
                        {'activity-update': announced(item.event), 'activity-nested': item.nested, 'activity-open': expanded(item.event)},
                        tone(item.event) && `tone-${tone(item.event)}`,
                    ]"
                    @click="toggle(item.event)"
                >
                    <span class="activity-text">
                        {{ heading(item.event) }}
                        <a class="activity-n" href="#" @click.prevent.stop="peek(item.event.type, item.event.n)">{{ item.event.n }}</a>
                    </span>
                    <template v-if="expanded(item.event) && title(item.event)">
                        <TextDisplay inline class="activity-title" :text="title(item.event)" />
                    </template>
                    <span class="activity-age">{{ who(item.event) }} · {{ age(item.event.at) || "just now" }}</span>
                </div>
            </template>
        </template>
    </TransitionGroup>
</template>

<style scoped>
.activity-fold {
    width: 100%;
    border: 0;
    background: none;
    text-align: left;
    font: inherit;
    cursor: pointer;
}

.activity-fold .activity-text {
    color: var(--text-3);
}

.activity-nested {
    padding-left: 18px;
}

.tone-warn,
.tone-good {
    border-left: 2px solid var(--tone);
}

.tone-warn {
    --tone: var(--tone-warn);
}

.tone-good {
    --tone: var(--tone-good);
}

.tone-warn .activity-text,
.tone-good .activity-text {
    color: var(--tone);
}

.activity-list {
    position: relative;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 8px 0 12px;
}

.activity-row {
    display: flex;
    flex-direction: column;
    gap: 1px;
    padding: 5px 8px;
}

.activity-text {
    font-size: 12px;
    color: var(--text-2);
    line-height: 1.45;
    overflow-wrap: anywhere;
}

.activity-title {
    font-size: 11.5px;
    color: var(--text-3);
    line-height: 1.4;
    overflow-wrap: anywhere;
}

.activity-age {
    font-size: 11px;
    color: var(--text-3);
    white-space: nowrap;
    opacity: 0.8;
}

.act-enter-active {
    transition:
        opacity 0.24s ease-out,
        transform 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.act-enter-from {
    opacity: 0;
    transform: translateY(-8px);
}

.act-leave-active {
    position: absolute;
    left: 0;
    right: 0;
    transition: opacity 0.18s ease-in;
}

.act-leave-to {
    opacity: 0;
}

.act-move {
    transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.activity-link {
    color: inherit;
    border-radius: 7px;
    cursor: pointer;
}

a.activity-n {
    color: inherit;
    text-decoration: none;
}

a.activity-n:hover {
    color: var(--accent-text);
    opacity: 1;
}

.activity-link:hover {
    background: var(--hover);
}

.activity-link:hover .activity-text {
    color: var(--text);
}

.activity-n {
    margin-left: 0.35em;
    font-size: 10.5px;
    color: var(--text-3);
    opacity: 0.65;
    font-variant-numeric: tabular-nums;
}

.activity-n::before {
    content: "·";
    margin-right: 0.35em;
}

.activity-update {
    margin: 2px 0;
    border-radius: 8px;
    background: color-mix(in srgb, var(--accent) 16%, transparent);
    box-shadow: inset 2px 0 0 var(--accent);
}
</style>
