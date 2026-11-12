<script setup>
import {computed} from "vue";

// a line above the settings that says why they cannot be changed yet: they changed since they were read (stale), the
// journal refused what was sent (refused), or they could not be read at all (unreadable), which can be tried again
const KINDS = {
    stale: {text: "These settings changed since you opened them. Cancel to read them again.", role: "status"},
    refused: {text: "The journal refused this change.", role: "alert"},
    unreadable: {text: "The settings could not be read.", role: "alert"},
};
const props = defineProps({kind: {type: String, required: true}, text: {type: String, default: ""}});
const emit = defineEmits(["retry"]);

const shown = computed(() => props.text || KINDS[props.kind].text);
</script>

<template>
    <div :class="['setting-banner', kind]" :role="KINDS[kind].role" :data-banner="kind">
        <span>{{ shown }}</span>
        <template v-if="kind === 'unreadable'">
            <button type="button" data-banner-retry @click="emit('retry')">Try again</button>
        </template>
    </div>
</template>

<style scoped>
.setting-banner { display: flex; align-items: center; gap: 12px; margin: 0 18px 12px; padding: 9px 12px; border: 1px solid var(--accent); border-radius: 8px; background: var(--accent-dim); color: var(--text); font-size: 12.5px; }
.setting-banner.refused, .setting-banner.unreadable { border-color: var(--danger); background: transparent; color: var(--danger); }
button { margin-left: auto; height: 26px; padding: 0 10px; border: 1px solid var(--border-2); border-radius: 7px; background: var(--bg); color: var(--text); font: inherit; font-size: 12px; cursor: pointer; }
button:hover { background: var(--hover); }
</style>
