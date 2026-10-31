<script setup>
import {computed, watch} from "vue";
import OutputLines from "../kit/OutputLines.vue";
import ModuleBody from "../windows/ModuleBody.vue";
import {api} from "../api/client.js";
import {useOutputPages} from "../composables/outputPages.js";

// what an opened mark shows: its module's own body where the declaration names one, else version 4's lines, summary and output
const props = defineProps({declaration: {type: Object, required: true}, mark: {type: Object, required: true}, shown: Boolean});

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
                <ModuleBody :declaration="declaration" />
            </template>
            <template v-else>
                <template v-if="hasOutput && pages.loaded.value">
                    <p class="mark-label">Output</p>
                    <OutputLines class="mark-terminal" :lines="pages.lines.value" @older="pages.older" />
                </template>
                <template v-else-if="lines.length">
                    <p class="mark-lines">{{ lines.join("\n") }}</p>
                </template>
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
    white-space: pre-line;
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
