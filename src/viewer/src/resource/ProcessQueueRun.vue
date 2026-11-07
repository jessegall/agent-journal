<script setup>
import {computed, nextTick, ref, watch} from "vue";
import {useOutputPages} from "../composables/outputPages.js";
import {useSharedNow} from "../composables/now.js";
import {useResourceEvents} from "./resourceEvents.js";
import {peek} from "../route.js";
import Icon from "../kit/Icon.vue";
const props = defineProps({run: {type: Object, required: true}, environment: {type: String, required: true}, position: {type: Number, required: true}, read: {type: Function, required: true}, expanded: Boolean});
const emit = defineEmits(["toggle"]);
const output = ref();
const pages = useOutputPages((words) => props.read([...words, "--limit", "50"]), () => props.run.id);
const lines = pages.lines;
const now = useSharedNow();
const type = computed(() => ({test: "Test run", build: "Build", check: "Check", install: "Install"})[props.run.category] || props.run.category.charAt(0).toUpperCase() + props.run.category.slice(1));
const duration = computed(() => {
    const start = props.run.section === "waiting" ? props.run.created_at : props.run.started_at;
    if (!start) return "";
    const end = props.run.ended_at ? new Date(props.run.ended_at).getTime() : now.value * 1000;
    const seconds = Math.max(0, Math.floor((end - new Date(start).getTime()) / 1000));
    if (seconds < 60) return `${seconds} s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} m ${seconds % 60} s`;
    return `${Math.floor(seconds / 3600)} h ${String(Math.floor(seconds / 60) % 60).padStart(2, "0")} m`;
});
async function refresh() {
    if (!props.expanded) return;
    const box = output.value;
    const atEnd = box.scrollHeight - box.scrollTop - box.clientHeight < 2;
    await pages.follow();
    await nextTick();
    if (props.expanded && atEnd) box.scrollTop = box.scrollHeight;
}
async function open() {
    if (!props.expanded) return;
    await pages.newest();
    await nextTick();
    if (!props.expanded) return;
    output.value.scrollTop = output.value.scrollHeight;
    pages.feed.drawn(output.value);
}
watch(() => props.expanded, open, {immediate: true});
useResourceEvents(["output.*"], refresh);
</script>
<template>
    <div class="run" :data-queue-row="run.section" :data-queue-process="run.id">
        <div class="toggle" role="button" tabindex="0" :aria-expanded="expanded" @click="emit('toggle')" @keydown.enter.prevent="emit('toggle')" @keydown.space.prevent="emit('toggle')">
            <div class="run-line"><span class="leading"><template v-if="run.section === 'waiting'"><span data-queue-position>{{ position }}</span></template><template v-else><span :class="['dot', {ring: run.section === 'running' && !run.uses_slot, passed: run.section === 'recent' && run.state === 'finished', failed: run.section === 'recent' && run.state !== 'finished'}]" :title="run.section === 'running' && !run.uses_slot ? 'Running, not counted in the limit' : run.section === 'recent' ? (run.state === 'finished' ? 'Passed' : 'Failed') : 'Running'" /></template></span>
                <code class="command">{{ run.line }}</code><span class="time" data-queue-time>{{ duration }}</span><Icon class="chevron" :class="{open: expanded}" name="chevronRight" facing="down" :size="12" />
            </div>
            <div class="details"><span data-queue-type>{{ type }}</span><template v-if="run.owner_agent_id"><span class="separator">·</span><button type="button" class="link" data-queue-agent @click.stop="peek('agents', run.owner_agent_id)">Agent {{ run.owner_agent_id }}</button></template><template v-else-if="run.is_main"><span class="separator">·</span><span>Main agent</span></template><template v-if="run.task_id"><span class="separator">·</span><button type="button" class="link" data-queue-task @click.stop="peek('tasks', run.task_id)">Task {{ run.task_id }}</button></template><template v-if="run.state === 'failed'"><span class="separator">·</span><span class="failed">Failed, exit {{ run.exit_code }}</span></template></div>
        </div>
        <div class="drop" :class="{open: expanded}"><div class="drop-inner"><div class="output"><div class="output-heading"><span>Output {{ run.id }}</span><a :href="`?page=processes.output&output=${run.id}&environment=${encodeURIComponent(environment)}`" target="_blank" rel="noopener">Open output window</a></div><pre ref="output" data-queue-output-body @scroll="expanded && pages.loadEarlier($event.target)"><span class="prompt">$ </span>{{ run.line }}<template v-if="lines.length">{{ '\n' + lines.join('\n') }}</template></pre></div></div></div>
    </div>
</template>
<style scoped>
.run { width:100%; background:var(--bg); border-bottom:1px solid var(--border); }
.toggle { cursor:pointer; } .toggle:hover { background:var(--hover); }
.run-line { display:flex; align-items:center; gap:10px; padding:9px 14px 2px; }
.leading { display:grid; place-items:center; flex:none; width:18px; color:var(--text-3); font-size:12px; font-variant-numeric:tabular-nums; }
.dot { width:7px; height:7px; border-radius:50%; background:var(--accent); } .dot.ring { background:transparent; box-shadow:inset 0 0 0 1.5px var(--accent); } .dot.passed { background:var(--tone-good); } .dot.failed { background:var(--danger); }
.command { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:var(--text); font:12px var(--font-mono, monospace); }
.time { flex:none; color:var(--text-2); font-size:12px; font-variant-numeric:tabular-nums; }
.chevron { flex:none; color:var(--text-4); transition:transform 200ms; } .chevron.open { transform:rotate(180deg); } .toggle:hover .chevron { color:var(--text-2); }
.details { display:flex; flex-wrap:wrap; gap:0 6px; padding:0 38px 9px 42px; color:var(--text-3); font-size:11.5px; } .separator { color:var(--text-4); } .failed { color:var(--danger); }
.link { padding:0; border:0; background:none; color:inherit; font:inherit; cursor:pointer; } .link:hover { color:var(--accent-text); }
.drop { display:grid; grid-template-rows:0fr; transition:grid-template-rows 200ms cubic-bezier(.2,.9,.25,1); } .drop.open { grid-template-rows:1fr; } .drop-inner { min-height:0; overflow:hidden; }
.output { background:var(--term); color:#c9ccd3; font:11px/1.6 var(--font-mono, monospace); }
.output-heading { display:flex; justify-content:space-between; gap:8px; padding:5px 14px; border-bottom:1px solid #25272b; color:#83868e; } .output-heading a, .prompt { color:#a3a8f0; } .output-heading a { text-decoration:none; } .output-heading a:hover { text-decoration:underline; }
pre { max-height:200px; overflow:auto; margin:0; padding:7px 14px; white-space:pre-wrap; overflow-wrap:anywhere; }
@media (prefers-reduced-motion: reduce) { .drop, .chevron { transition:none; } }
</style>
