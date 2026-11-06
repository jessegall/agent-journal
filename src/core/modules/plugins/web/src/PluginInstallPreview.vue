<script setup>
import {Btn, Dialog} from "@journal/window-kit";

defineProps({preview: {type: Object, required: true}});
const emit = defineEmits(["close", "install"]);
const WRONG_KEY = "wrong key";
const CATEGORIES = {files: "Part of what it runs", requires: "Checks", setup: "Sets up", installed: "Asks", program: "On events", service: "Keeps running", alias: "Command", reads: "Reads from the project", guard: "Before a change", listen: "During a change", commit: "After a change"};
</script>

<template>
    <Dialog :title="preview.title" @close="emit('close')">
        <div data-plugin-preview>
            <p class="preview-from">Version {{ preview.version }} from {{ preview.source }}</p>
            <p class="preview-lead">It runs as you, with your files and your network. This is everything it runs:</p>
            <template v-if="!preview.rows.length">
                <p class="preview-lead">It runs nothing.</p>
            </template>
            <template v-for="row in preview.rows" :key="`${row.category} ${row.label}`">
                <div class="preview-row" :data-preview-category="row.category">
                    <span class="preview-category">{{ row.state === WRONG_KEY ? "Wrong event" : CATEGORIES[row.category] }}</span>
                    <span class="preview-label">{{ row.label }}</span>
                    <code class="preview-command">{{ row.state === WRONG_KEY ? "No such event. It can be installed, but this script will never run." : row.command }}</code>
                </div>
            </template>
        </div>
        <template #foot>
            <Btn @click="emit('close')">Cancel</Btn>
            <Btn variant="primary" data-plugin-preview-install @click="emit('install')">Install</Btn>
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

.preview-category {
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
