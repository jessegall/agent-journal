<script setup>
import {ref} from "vue";
import {CLASS_LANES, CLASS_PRIORITIES, classOptions} from "./executionClasses.js";

const props = defineProps({entry: {type: Object, required: true}, saving: Boolean});
const emit = defineEmits(["send"]);
const editing = ref(false);
const draft = ref({});
const ORIGINS = {"built-in": "Built in", changed: "Changed", "your own": "Your own"};
function edit() {
    draft.value = {...props.entry};
    editing.value = true;
}
function save() {
    emit("send", ["queue-class", "set", props.entry.name, ...classOptions(draft.value)], () => (editing.value = false));
}
</script>

<template>
    <tr :data-class-row="entry.name">
        <th scope="row">{{ entry.name }}<template v-if="entry.pattern || entry.plugin"><small>{{ entry.pattern || `plugin ${entry.plugin}` }}</small></template></th>
        <template v-if="editing">
            <td><select v-model="draft.lane" aria-label="Lane" data-class-lane><template v-for="lane in CLASS_LANES" :key="lane"><option :value="lane">{{ lane }}</option></template></select></td>
            <td><input v-model.number="draft.cost" type="number" min="0" aria-label="Slot units" data-class-cost /></td>
            <td><select v-model="draft.priority" aria-label="Priority" data-class-priority><template v-for="priority in CLASS_PRIORITIES" :key="priority"><option :value="priority">{{ priority }}</option></template></select></td>
            <td><input v-model.number="draft.limit" type="number" min="0" aria-label="At once, 0 for no limit" data-class-limit /></td>
            <td class="actions"><button type="button" :disabled="saving" data-class-save @click="save">Save</button><button type="button" :disabled="saving" @click="editing = false">Cancel</button></td>
        </template>
        <template v-else>
            <td>{{ entry.lane }}</td>
            <td>{{ entry.cost }}</td>
            <td>{{ entry.priority }}</td>
            <td>{{ entry.limit || "no limit" }}</td>
            <td class="actions">
                <span :class="['origin', {own: entry.origin !== 'built-in'}]">{{ ORIGINS[entry.origin] }}</span>
                <button type="button" :disabled="saving" data-class-edit @click="edit">Edit</button>
                <template v-if="entry.origin === 'changed'"><button type="button" :disabled="saving" data-class-reset @click="emit('send', ['queue-class', 'reset', entry.name])">Reset</button></template>
                <template v-if="entry.origin === 'your own'"><button type="button" :disabled="saving" data-class-remove @click="emit('send', ['queue-class', 'remove', entry.name])">Remove</button></template>
            </td>
        </template>
    </tr>
</template>

<style scoped>
th, td { padding:6px 8px; border-top:1px solid var(--border); text-align:left; font-size:12px; font-weight:400; vertical-align:middle; }
th small { display:block; color:var(--text-3); font-size:11px; word-break:break-all; }
input { width:64px; height:24px; padding:0 4px; border:1px solid var(--border-2); border-radius:5px; background:none; color:var(--text); font:inherit; }
select { width:88px; height:24px; font:inherit; }
.actions { white-space:nowrap; text-align:right; }
.actions button { margin-left:6px; padding:2px 8px; border:1px solid var(--border-2); border-radius:5px; background:none; color:var(--text-2); font:inherit; cursor:pointer; }
.actions button:hover { color:var(--text); }
.origin { color:var(--text-3); font-size:11px; }
.origin.own { color:var(--accent); }
button:disabled { opacity:.4; cursor:default; }
</style>
