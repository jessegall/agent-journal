<script setup>
import {ref, watch} from "vue";

// the context size at which agents of one helper type are compacted: a number of tokens, none, or empty for the size of its kind of agent
const props = defineProps({row: {type: Object, required: true}, pending: Boolean, readOnly: Boolean});
const emit = defineEmits(["change"]);
const text = ref(props.row.context_cap || "");
watch(() => props.row.context_cap, (value) => { text.value = value || ""; });
function save() {
    const value = text.value.trim().toLowerCase();
    if (value === (props.row.context_cap || "")) return;
    emit("change", value || "default");
}
</script>

<template>
    <label class="cap" data-agent-context-cap>
        Compact at this context size
        <input type="text" inputmode="numeric" placeholder="Same as its kind of agent" v-model="text" :disabled="pending || readOnly" data-agent-context-cap-input @change="save" />
        <small>A number of tokens, or none for no limit. Leave it empty to use the size set for its kind of agent.</small>
    </label>
</template>

<style scoped>
.cap { display: block; padding: 0 0 12px; border-bottom: 1px solid var(--border); margin-bottom: 12px; }
.cap input { display: block; width: 100%; max-width: 220px; height: 32px; margin-top: 4px; border: 1px solid var(--border); background: var(--raised); color: var(--text); padding: 0 8px; }
small { display: block; color: var(--text-3); margin-top: 4px; }
@media (max-width: 600px) { .cap input { height: 44px; } }
</style>
