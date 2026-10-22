<script setup>
import {onMounted, ref} from "vue";
import {api} from "../api/client.js";
import Dialog from "../kit/Dialog.vue";

const props = defineProps({n: {type: Number, required: true}, owner: {type: String, default: ""}});
const emit = defineEmits(["close"]);
const output = ref(null);
const failed = ref("");

onMounted(() => !props.owner && api.readOutput(props.n).then((got) => (output.value = got), (e) => (failed.value = e.message)));
</script>

<template>
    <Dialog :title="`Output ${n}`" tall @close="emit('close')">
        <template v-if="owner">
            <p class="output-note">This output stays on {{ owner }}'s machine; its card in the chat shows how it goes.</p>
        </template>
        <template v-else-if="failed">
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
            <template v-if="output.lines.length">
                <pre class="output-lines">{{ output.lines.join("\n") }}</pre>
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
    padding: 6px 16px 16px;
    color: var(--text-2);
}

.output-note {
    margin: 0;
    padding: 14px 16px;
    color: var(--text-2);
    font-size: 13px;
}
</style>
