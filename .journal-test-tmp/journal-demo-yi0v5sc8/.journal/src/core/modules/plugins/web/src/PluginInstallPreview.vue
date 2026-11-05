<script setup>
import {Btn, Dialog} from "@journal/window-kit";

defineProps({preview: {type: Object, required: true}});
const emit = defineEmits(["close", "install"]);
const KINDS = {requires: "Checks", setup: "Sets up", installed: "Asks", program: "On events", service: "Keeps running", alias: "Command"};
</script>

<template>
    <Dialog :title="preview.title" @close="emit('close')">
        <div data-plugin-preview>
            <p class="preview-from">Version {{ preview.version }} from {{ preview.source }}</p>
            <p class="preview-lead">It runs as you, with your files and your network. This is everything it runs:</p>
            <template v-if="!preview.rows.length">
                <p class="preview-lead">It runs nothing.</p>
            </template>
            <template v-for="row in preview.rows" :key="`${row.kind} ${row.label}`">
                <div class="preview-row" :data-preview-kind="row.kind">
                    <span class="preview-kind">{{ KINDS[row.kind] }}</span>
                    <span class="preview-label">{{ row.label }}</span>
                    <code class="preview-command">{{ row.command }}</code>
                </div>
            </template>
        </div>
        <template #foot>
            <Btn @click="emit('close')">Cancel</Btn>
            <Btn kind="primary" data-plugin-preview-install @click="emit('install')">Install</Btn>
        </template>
    </Dialog>
</template>

<style scoped>
.preview-from,
.preview-lead {
    margin: 0 0 10px;
    color: var(--text-2);
    font-size: 12.5px;
}

.preview-row {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 10px;
    align-items: baseline;
    padding: 5px 0;
    border-top: 1px solid var(--border);
}

.preview-kind {
    flex: 0 0 90px;
    color: var(--text-3);
    font-size: 12px;
}

.preview-command {
    flex-basis: 100%;
    font-size: 12px;
    overflow-wrap: anywhere;
}
</style>
