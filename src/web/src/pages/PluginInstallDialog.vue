<script setup>
import Btn from "../kit/Btn.vue";
import Console from "../kit/Console.vue";
import Dialog from "../kit/Dialog.vue";

defineProps({
    previewed: {type: Object, required: true},
    outcome: {type: Object, default: null},
    live: {type: String, default: ""},
    busy: {type: String, default: ""},
});
const emit = defineEmits(["close", "back", "install"]);
const KINDS = {needs: "Needs", setup: "On install", service: "Runs", on: "Listens", refuse: "May refuse", page: "Page", setting: "Setting"};
</script>

<template>
    <Dialog :title="previewed.title" @close="emit('close')">
        <template v-if="outcome">
            <p :class="['preview-result', {failed: !outcome.ok}]">
                {{ outcome.ok ? `${previewed.title} is installed.` : "It did not install. Nothing of it was kept." }}
            </p>
            <Console fill :text="live || outcome.text" />
        </template>
        <template v-else-if="busy === 'install'">
            <p class="preview-result">{{ previewed.upgrading ? "Upgrading" : "Installing" }}…</p>
            <Console fill :text="live || 'Starting…'" />
        </template>
        <template v-else>
            <p class="preview-from">
                from {{ previewed.source }}
                <template v-if="previewed.commit">at {{ previewed.commit.slice(0, 12) }}</template>
            </p>
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
                <template v-if="previewed.changes && previewed.changes.length">
                    <div class="preview-rows changes">
                        <template v-for="(c, i) in previewed.changes" :key="i">
                            <div class="preview-row">
                                <span :class="['preview-kind', c.kind]">{{ c.kind === "new" ? "Now also" : "No longer" }}</span>
                                <code class="preview-command">{{ c.line }}</code>
                            </div>
                        </template>
                    </div>
                </template>
            </template>
            <p class="preview-lead">It runs as you, with your files and your network. This is everything it does:</p>
            <div class="preview-rows">
                <template v-for="(row, i) in previewed.rows" :key="i">
                    <div class="preview-row">
                        <span :class="['preview-kind', row.kind]">{{ KINDS[row.kind] || row.kind }}</span>
                        <span class="preview-label">{{ row.label }}</span>
                        <code class="preview-command">{{ row.command }}</code>
                    </div>
                </template>
            </div>
        </template>
        <template #foot>
            <template v-if="outcome">
                <template v-if="!outcome.ok">
                    <Btn @click="emit('back')">Back</Btn>
                </template>
                <Btn kind="primary" @click="emit('close')">Close</Btn>
            </template>
            <template v-else>
                <Btn :disabled="busy === 'install'" @click="emit('close')">Cancel</Btn>
                <Btn kind="primary" :busy="busy === 'install'" :disabled="busy === 'install'" @click="emit('install')">Run</Btn>
            </template>
        </template>
    </Dialog>
</template>

<style scoped>
.preview-result {
    margin: 0 0 10px;
    color: var(--tone-good);
    font-size: 13px;
}

.preview-result.failed {
    color: var(--danger);
}

.preview-from,
.preview-what,
.preview-lead {
    margin: 0 0 8px;
    color: var(--text-3);
    font-size: 12.5px;
}

.preview-what {
    color: var(--text-2);
}

.preview-rows {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.preview-rows.changes {
    margin-bottom: 14px;
}

.preview-row {
    display: grid;
    grid-template-columns: 92px 1fr;
    gap: 4px 10px;
    padding: 8px 10px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--raised);
    font-size: 12.5px;
}

.preview-kind {
    color: var(--text-3);
    font-size: 11px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.preview-kind.new {
    color: var(--tone-good);
}

.preview-kind.gone {
    color: var(--danger);
}

.preview-kind.refuse {
    color: var(--tone-warn);
}

.preview-label {
    color: var(--text);
}

.preview-command {
    grid-column: 2;
    color: var(--text-2);
    font-family: var(--mono);
    font-size: 11.5px;
    word-break: break-all;
}
</style>
