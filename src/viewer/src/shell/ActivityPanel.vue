<script setup>
import {computed, onMounted, ref} from "vue";
import {ago} from "../format/time.js";
import {meta} from "../domain/tables.js";
import {peekRef} from "../route.js";

const props = defineProps({events: {type: Array, default: () => []}});
const busy = new Set(["agents", "hook_calls", "agent_lines", "nudge_records"]);
const openedGroups = ref(new Set());
const openedEvents = ref(new Set());
const settled = ref(false);
onMounted(() => setTimeout(() => (settled.value = true), 400));
const minute = (event) => Math.floor(Date.parse(event.timestamp) / 60000);
const visible = (event) => busy.has(event.row_table) || Boolean(meta(event.row_table));
const groups = computed(() => {
    const rows = [];
    for (const event of props.events.filter(visible)) {
        const last = rows.at(-1);
        if (busy.has(event.row_table) && last?.events && last.minute === minute(event)) {
            last.events.push(event);
            last.key = `group-${event.id}`;
        } else if (busy.has(event.row_table)) {
            rows.push({key: `group-${event.id}`, minute: minute(event), events: [event]});
        } else {
            rows.push({key: event.id, event});
        }
    }
    return rows;
});
const items = computed(() => groups.value.flatMap((group) => group.events
    ? [group, ...(openedGroups.value.has(group.key) ? group.events.map((event) => ({key: event.id, event, nested: true})) : [])]
    : [group]));
function toggle(set, key) {
    if (set.has(key)) set.delete(key);
    else set.add(key);
}
const heading = (event) => {
    if (event.row_table === "hook_calls") return "Agent activity";
    if (event.row_table === "agent_lines" || event.row_table === "nudge_records") return "Agent instruction";
    const name = meta(event.row_table)?.title || "Agent";
    const action = event.event.split(".").at(-1);
    if (action === "create") return `New ${name.toLowerCase()}`;
    if (action === "delete") return `Deleted ${name.toLowerCase()}`;
    return `Updated ${name.toLowerCase()}`;
};
const title = (event) => event.data?.title?.[1] || event.data?.text?.[1] || event.data?.summary?.[1] || "";
const when = (event) => ago(event.timestamp) || "just now";
const count = (events) => {
    const instructions = events.filter((event) => event.row_table === "agent_lines" || event.row_table === "nudge_records").length;
    const agents = events.length - instructions;
    return [agents ? `${agents} agent ${agents === 1 ? "update" : "updates"}` : "", instructions ? `${instructions} agent ${instructions === 1 ? "instruction" : "instructions"}` : ""].filter(Boolean).join(", ");
};
</script>

<template>
    <aside class="activity" data-activity>
        <div class="activity-head"><span>Activity</span></div>
        <TransitionGroup tag="div" class="activity-list" :name="settled ? 'act' : ''">
            <template v-for="item in items" :key="item.key">
                <template v-if="item.events"><button type="button" class="activity-row activity-fold" data-activity-group @click="toggle(openedGroups, item.key)">
                    <span class="activity-text">{{ count(item.events) }}</span><span class="activity-age">{{ when(item.events[0]) }}</span>
                </button></template>
                <template v-else><div :class="['activity-row', 'activity-link', {nested: item.nested}]" :data-activity-nested="item.nested ? '' : undefined" :data-activity-event="item.event.id" @click="toggle(openedEvents, item.event.id)">
                    <span class="activity-text">{{ heading(item.event) }} <template v-if="meta(item.event.row_table)"><button type="button" class="activity-number" @click.stop="peekRef(`${item.event.row_table}:${item.event.row_id}`)">{{ item.event.row_id }}</button></template></span>
                    <template v-if="openedEvents.has(item.event.id) && title(item.event)"><span class="activity-title">{{ title(item.event) }}</span></template>
                    <span class="activity-age">{{ when(item.event) }}</span>
                </div></template>
            </template>
        </TransitionGroup>
    </aside>
</template>

<style scoped>
.activity { display:flex; flex:none; flex-direction:column; width:290px; min-height:0; padding:0 10px; overflow:hidden; border-left:1px solid var(--border); background:var(--side); }
.activity-head { display:flex; align-items:center; height:48px; flex:none; margin:0 -10px; padding:0 18px; border-bottom:1px solid var(--border); }
.activity-head span { display:inline-flex; align-items:center; height:100%; color:var(--text); font-size:11.5px; letter-spacing:.03em; box-shadow:inset 0 -1px 0 var(--accent); }
.activity-list { position:relative; flex:1; min-height:0; overflow-y:auto; padding:8px 0 12px; }
.activity-row { display:flex; flex-direction:column; gap:1px; padding:5px 8px; }
.activity-fold { width:100%; border:0; background:none; text-align:left; font:inherit; cursor:pointer; }
.activity-fold .activity-text, .activity-title { color:var(--text-3); }
.activity-link { border-radius:7px; cursor:pointer; }
.activity-link:hover { background:var(--hover); }
.activity-link:hover .activity-text { color:var(--text); }
.nested { padding-left:18px; }
.activity-text { color:var(--text-2); font-size:12px; line-height:1.45; overflow-wrap:anywhere; }
.activity-title { font-size:11.5px; line-height:1.4; overflow-wrap:anywhere; }
.activity-age { color:var(--text-3); font-size:11px; white-space:nowrap; opacity:.8; }
.activity-number { padding:0; border:0; background:none; color:var(--text-3); font:inherit; font-size:10.5px; cursor:pointer; }
.activity-number:hover { color:var(--accent-text); }
.act-enter-active { transition:opacity .24s ease-out, transform .24s cubic-bezier(.2,.8,.2,1); }
.act-enter-from { opacity:0; transform:translateY(-8px); }
.act-leave-active { transition:opacity .18s ease-in; }
.act-leave-to { opacity:0; }
.act-move { transition:transform .28s cubic-bezier(.2,.8,.2,1); }
@media (prefers-reduced-motion: reduce) { .act-enter-active, .act-leave-active, .act-move { transition:none; } }
</style>
