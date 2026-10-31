<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import {useOutputPages} from "../composables/outputPages.js";
import {api} from "../api/client.js";
import Dialog from "../kit/Dialog.vue";
import OutputLines from "../kit/OutputLines.vue";

// while its run goes on, an opened output reads its new lines this often
const POLL_MS = 2000;

const props = defineProps({n: {type: Number, required: true}});
const emit = defineEmits(["close"]);
const pages = useOutputPages((...page) => api.readOutput(props.n, ...page));
const output = pages.facts;
const failed = ref("");

let timer = 0;
const read = () => pages.poll().catch((e) => (failed.value = e.message));
onMounted(() => {
    read();
    timer = setInterval(() => output.value && !output.value.ended && read(), POLL_MS);
});
onUnmounted(() => clearInterval(timer));
</script>

<template>
    <Dialog :title="`Output ${n}`" tall @close="emit('close')">
        <template v-if="failed">
            <p class="output-note" role="alert">{{ failed }}</p>
        </template>
        <template v-else-if="output">
            <div class="output-facts">
                <span class="output-label">Command</span>
                <pre class="output-command">{{ output.command }}</pre>
                <span class="output-label">How it ended</span>
                <span class="output-outcome">{{ output.outcome }}</span>
                <span class="output-label">Output</span>
            </div>
            <template v-if="pages.lines.value.length">
                <OutputLines class="output-lines" :lines="pages.lines.value" @older="pages.older" />
            </template>
            <template v-else>
                <p class="output-note">It printed nothing.</p>
            </template>
        </template>
        <template v-else>
            <p class="output-note">Reading the output…</p>
        </template>
    </Dialog>
</template>

<style scoped>
.output-facts {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 14px 16px 0;
}

.output-label {
    margin-top: 8px;
    color: var(--text-3);
    font-size: 11.5px;
}

.output-command,
.output-lines {
    margin: 0;
    font-family: var(--mono);
    font-size: 12px;
    line-height: 1.5;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}

.output-command {
    color: var(--text);
}

.output-outcome {
    color: var(--text);
    font-size: 13px;
}

.output-lines {
    max-height: 60vh;
    padding: 6px 16px 16px;
    overflow: auto;
    color: var(--text-2);
}

.output-note {
    margin: 0;
    padding: 14px 16px;
    color: var(--text-2);
    font-size: 13px;
}
</style>
