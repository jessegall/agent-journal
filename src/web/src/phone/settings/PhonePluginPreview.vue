<script setup>
import {ref} from "vue";
import PhoneSheet from "../PhoneSheet.vue";
import PhoneTerm from "./PhoneTerm.vue";

defineProps({
    previewed: {type: Object, required: true},
    outcome: {type: Object, default: null},
    live: {type: String, default: ""},
    busy: {type: String, default: ""},
});
const emit = defineEmits(["close", "install"]);
const sheet = ref(null);
const KINDS = {needs: "Needs", setup: "On install", service: "Runs", on: "Listens", refuse: "May refuse", page: "Page", setting: "Setting"};
</script>

<template>
    <PhoneSheet ref="sheet" :label="previewed.title" tall @close="emit('close')">
        <template #head>
            <h2 class="preview-title">{{ previewed.title }}</h2>
            <p class="preview-from">from {{ previewed.source }}<template v-if="previewed.commit"> at {{ previewed.commit.slice(0, 12) }}</template></p>
        </template>
        <template v-if="outcome">
            <p :class="['preview-result', {failed: !outcome.ok}]">
                {{ outcome.ok ? `${previewed.title} is installed.` : "It did not install. Nothing of it was kept." }}
            </p>
            <PhoneTerm :text="live || outcome.text" />
            <button type="button" class="preview-go" @click="sheet.close()">Close</button>
        </template>
        <template v-else-if="busy === 'install'">
            <p class="preview-result">{{ previewed.upgrading ? "Upgrading" : "Installing" }}…</p>
            <PhoneTerm :text="live || 'Starting…'" />
        </template>
        <template v-else>
            <template v-if="previewed.description">
                <p class="preview-what">{{ previewed.description }}</p>
            </template>
            <template v-if="previewed.upgrading">
                <p class="preview-lead">
                    {{
                        previewed.current
                            ? "It is already at this commit. Run goes through its install steps again."
                            : previewed.changes.length
                              ? "What it runs changes:"
                              : "It runs the same commands as the version you have."
                    }}
                </p>
                <template v-for="(change, i) in previewed.changes || []" :key="i">
                    <p class="preview-row"><b>{{ change.kind === "new" ? "Now also" : "No longer" }}</b><code>{{ change.line }}</code></p>
                </template>
            </template>
            <p class="preview-lead">It runs as you, with your files and your network. This is everything it does:</p>
            <template v-for="(row, i) in previewed.rows" :key="i">
                <p class="preview-row"><b>{{ KINDS[row.kind] || row.kind }}</b>{{ row.label }}<code>{{ row.command }}</code></p>
            </template>
            <div class="preview-buttons">
                <button type="button" class="preview-no" @click="sheet.close()">Cancel</button>
                <button type="button" class="preview-go" @click="emit('install')">{{ previewed.upgrading ? "Upgrade" : "Install" }}</button>
            </div>
        </template>
    </PhoneSheet>
</template>

<style scoped>
.preview-title {
    margin: 0;
    font-size: 1.0625rem;
}

.preview-from,
.preview-lead,
.preview-what {
    margin: 6px 0;
    color: var(--text-3);
    font-size: 0.875rem;
}

.preview-result {
    margin: 4px 0 10px;
    color: var(--ok, var(--text));
}

.preview-result.failed {
    color: var(--danger);
}

.preview-row {
    margin: 0 0 10px;
    font-size: 0.9375rem;
}

.preview-row b {
    display: block;
    color: var(--text-3);
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

.preview-row code {
    display: block;
    overflow-wrap: anywhere;
    color: var(--text-2);
    font-size: 0.8125rem;
}

.preview-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin: 12px 0;
}

.preview-no,
.preview-go {
    min-height: 44px;
    border: 0;
    border-radius: 12px;
    background: var(--sel);
    color: var(--text);
    font: inherit;
}

.preview-go {
    background: var(--accent);
    color: #fff;
}
</style>
