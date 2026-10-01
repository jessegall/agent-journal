<script setup>
import Btn from "../kit/Btn.vue";
import Console from "../kit/Console.vue";
import Dialog from "../kit/Dialog.vue";

defineProps({
    shown: {type: Object, required: true},
    outcome: {type: Object, default: null},
    live: {type: String, default: ""},
    busy: {type: String, default: ""},
});
const emit = defineEmits(["close", "back", "install"]);
const KINDS = {needs: "Needs", setup: "On install", service: "Runs", on: "Listens", refuse: "May refuse", page: "Page", setting: "Setting"};
</script>

<template>
    <Dialog :title="shown.title" fixed @close="emit('close')">
        <template v-if="outcome">
            <p :class="['shown-result', {failed: !outcome.ok}]">
                {{ outcome.ok ? `${shown.title} is installed.` : "It did not install. Nothing of it was kept." }}
            </p>
            <Console fill :text="live || outcome.text" />
        </template>
        <template v-else-if="busy === 'install'">
            <p class="shown-result">{{ shown.upgrading ? "Upgrading" : "Installing" }}…</p>
            <Console fill :text="live || 'Starting…'" />
        </template>
        <template v-else>
            <p class="shown-from">
                from {{ shown.source }}
                <template v-if="shown.commit">at {{ shown.commit.slice(0, 12) }}</template>
            </p>
            <template v-if="shown.description">
                <p class="shown-what">{{ shown.description }}</p>
            </template>
            <template v-if="shown.upgrading">
                <p class="shown-lead">
                    {{
                        shown.current
                            ? "It is already at this commit. Run goes through its install steps again."
                            : shown.changes.length
                              ? "What it runs changes:"
                              : "It runs the same commands as the version you have."
                    }}
                </p>
                <template v-if="shown.changes && shown.changes.length">
                    <div class="shown-rows changes">
                        <template v-for="(c, i) in shown.changes" :key="i">
                            <div class="shown-row">
                                <span :class="['shown-kind', c.kind]">{{ c.kind === "new" ? "Now also" : "No longer" }}</span>
                                <code class="shown-command">{{ c.line }}</code>
                            </div>
                        </template>
                    </div>
                </template>
            </template>
            <p class="shown-lead">It runs as you, with your files and your network. This is everything it does:</p>
            <div class="shown-rows">
                <template v-for="(row, i) in shown.rows" :key="i">
                    <div class="shown-row">
                        <span :class="['shown-kind', row.kind]">{{ KINDS[row.kind] || row.kind }}</span>
                        <span class="shown-label">{{ row.label }}</span>
                        <code class="shown-command">{{ row.command }}</code>
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
.shown-result {
    margin: 0 0 10px;
    color: var(--tone-good);
    font-size: 13px;
}

.shown-result.failed {
    color: var(--danger);
}

.shown-from,
.shown-what,
.shown-lead {
    margin: 0 0 8px;
    color: var(--text-3);
    font-size: 12.5px;
}

.shown-what {
    color: var(--text-2);
}

.shown-rows {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.shown-rows.changes {
    margin-bottom: 14px;
}

.shown-row {
    display: grid;
    grid-template-columns: 92px 1fr;
    gap: 4px 10px;
    padding: 8px 10px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--raised);
    font-size: 12.5px;
}

.shown-kind {
    color: var(--text-3);
    font-size: 11px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.shown-kind.new {
    color: var(--tone-good);
}

.shown-kind.gone {
    color: var(--danger);
}

.shown-kind.refuse {
    color: var(--tone-warn);
}

.shown-label {
    color: var(--text);
}

.shown-command {
    grid-column: 2;
    color: var(--text-2);
    font-family: var(--mono);
    font-size: 11.5px;
    word-break: break-all;
}
</style>
