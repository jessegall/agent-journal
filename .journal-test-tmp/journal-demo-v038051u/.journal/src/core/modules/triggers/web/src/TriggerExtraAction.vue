<script setup>
import {Btn, DropList} from "@journal/window-kit";
import {EXTRA_ACTIONS} from "./triggerWords.js";

defineProps({entry: {type: Object, required: true}, position: {type: Number, required: true}});
const emit = defineEmits(["remove", "change"]);
</script>

<template>
    <div class="extra-action" data-trigger-extra-action>
        <div class="action-heading">
            <span class="number">{{ position }}</span>
            <DropList :label="EXTRA_ACTIONS.find((choice) => choice.value === entry.type).label" :items="EXTRA_ACTIONS" :picked="entry.type" @pick="emit('change', {type: $event.value})" />
            <Btn small title="Remove this action" @click="emit('remove')">×</Btn>
        </div>
        <label class="field"><span class="label">{{ entry.type === 'run' ? 'Command line' : 'Web address' }}</span><input :value="entry.target" :placeholder="entry.type === 'run' ? 'npm run lint' : 'https://example.com/notify'" data-trigger-listed @input="emit('change', {target: $event.target.value})"></label>
        <template v-if="entry.type === 'run'">
            <label class="field"><span class="label">Run it in</span><input :value="entry.folder" placeholder="The project folder" data-trigger-folder @input="emit('change', {folder: $event.target.value})"></label>
            <label class="printed"><input type="checkbox" role="switch" :checked="entry.notify_agent" data-trigger-printed @change="emit('change', {notify_agent: $event.target.checked})">Tell the agent what it printed</label>
            <p class="note">Sends the first 200 lines, up to 12,000 characters, with a link to the full output.</p>
        </template>
    </div>
</template>

<style scoped src="./triggerForm.css"></style>
<style scoped>
.extra-action { display: flex; flex-direction: column; gap: 10px; padding: 12px; border: 1px solid var(--border-2); border-radius: 10px; }
.action-heading { display: flex; align-items: center; gap: 8px; }
.action-heading > :nth-child(2) { flex: 1; min-height: 30px; }
.action-heading :deep(.drop-head) { flex: 1; justify-content: space-between; height: 30px; }
.number { display: grid; place-items: center; flex: none; width: 20px; height: 20px; border-radius: 50%; background: var(--bg-2); font-size: 11px; }
.printed { display: flex; align-items: center; gap: 8px; font-size: 12px; }
.printed input { appearance: none; flex: none; width: 30px; height: 18px; margin: 0; padding: 3px; border: 0; border-radius: 18px; background: var(--border-2); cursor: pointer; }
.printed input::before { content: ""; display: block; width: 12px; height: 12px; border-radius: 50%; background: var(--text-3); }
.printed input:checked { background: var(--accent); }
.printed input:checked::before { transform: translateX(12px); background: white; }
.note { margin: 0; color: var(--text-3); font-size: 12px; line-height: 1.5; }
</style>
