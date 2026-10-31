<script setup>
import {computed, watch} from "vue";
import OutputLines from "../kit/OutputLines.vue";
import FrameWindow from "../windows/FrameWindow.vue";
import PageWindow from "../windows/PageWindow.vue";
import {WindowSubscriptions} from "../windows/windowSubscriptions.js";
import {api} from "../api/client.js";
import {useOutputPages} from "../composables/outputPages.js";

// what an opened mark shows: its module's own body where the declaration names one, else version 4's lines, summary and output
const props = defineProps({declaration: {type: Object, required: true}, mark: {type: Object, required: true}, shown: Boolean});

const subscriptions = new WindowSubscriptions();
const permissions = {reads: [], runs: [], missing: [], ask: async () => true};
const entry = computed(() => ({
    name: `${props.declaration.module}.${props.declaration.type}`,
    entry_url: props.declaration.body_url,
    events: [],
    options: [],
}));
// a module the journal ships or the person trusts is drawn as a component; any other body is drawn in a sandboxed frame
const asComponent = computed(() => Boolean(props.declaration.shipped || props.declaration.trusted));
const lines = computed(() => String(props.mark.lines || "").split("\n").filter(Boolean));
const OUTPUT_MODEL = "output";
const pages = useOutputPages((...page) => api.readOutput(props.mark.target_id, ...page));
const hasOutput = computed(() => props.mark.target_model === OUTPUT_MODEL && Boolean(props.mark.target_id));
watch(() => props.shown && hasOutput.value, (reading) => reading && pages.poll().catch(() => {}), {immediate: true});
</script>

<template>
    <div :class="['mark-more', {open: shown}]" @click.stop>
        <div class="mark-more-inner">
            <template v-if="declaration.body_url">
                <PageWindow v-if="asComponent" :entry="entry" :subscriptions="subscriptions" environment="" :permissions="permissions" />
                <FrameWindow v-else :entry="entry" :subscriptions="subscriptions" environment="" :permissions="permissions" />
            </template>
            <template v-else>
                <template v-if="hasOutput && pages.loaded.value">
                    <p class="mark-label">Output</p>
                    <OutputLines class="mark-terminal" :lines="pages.lines.value" @older="pages.older" />
                </template>
                <ul v-else-if="lines.length" class="mark-lines">
                    <template v-for="line in lines" :key="line">
                        <li class="mark-line">{{ line }}</li>
                    </template>
                </ul>
            </template>
        </div>
    </div>
</template>

<style scoped>
.mark-more {
    grid-column: 1 / -1;
    contain: inline-size;
}

.mark-more:not(.open) {
    display: none;
}

.mark-lines {
    margin: 0;
    padding: 2px 0 0 20px;
    text-align: left;
    color: var(--text-2);
    font-size: 12px;
    line-height: 1.45;
    list-style: none;
    overflow-wrap: anywhere;
}

.mark-label {
    margin: 8px 0 2px 20px;
    color: var(--text-4);
    font-size: 10.5px;
}

.mark-terminal {
    max-height: 150px;
    margin: 0 0 2px 20px;
    padding: 8px 10px;
    overflow: auto;
    border-radius: 6px;
    background: var(--term);
    color: #d6d6d6;
    font:
        11px/1.55 ui-monospace,
        "SF Mono",
        Menlo,
        monospace;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}
</style>
