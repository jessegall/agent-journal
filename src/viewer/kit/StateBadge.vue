<script setup>
import {computed, inject, ref} from "vue";
import {WINDOW_CONTEXT} from "./windowContextKey.js";
import {stateLabel, stateTipRead} from "../src/domain/states.js";

// a row's state as its badge shows it: the words of the state, and, for a state whose module declared a read for it,
// a tooltip that opens on hover, focus or a press and reads that line only then
const props = defineProps({type: {type: String, required: true}, state: {type: String, required: true}, rowId: {type: Number, required: true}, read: {type: Function, default: null}});
const context = inject(WINDOW_CONTEXT, null);
const tipRead = computed(() => stateTipRead(props.type, props.state));
const open = ref(false);
const lines = ref([]);
const failure = ref("");

async function show() {
    open.value = true;
    const answer = await (props.read ?? context.read)(tipRead.value.replace("{row_id}", props.rowId));
    failure.value = answer.ok ? "" : answer.error;
    if (answer.ok) lines.value = answer.value.lines ?? [];
}
const hide = () => (open.value = false);
const toggle = () => (open.value ? hide() : show());
</script>

<template>
    <span v-if="tipRead" class="state-badge" tabindex="0" role="button" :aria-expanded="open" data-state-badge @mouseenter="show" @mouseleave="hide" @focus="show" @blur="hide" @click="toggle" @keydown.escape="hide">
        {{ stateLabel(type, state) }}
        <span v-if="open" class="state-tip" role="tooltip" data-state-tip>
            <span v-if="failure" class="tip-failure">{{ failure }}</span>
            <span v-for="(line, place) in lines" :key="place" class="tip-line">{{ line }}</span>
        </span>
    </span>
    <span v-else>{{ stateLabel(type, state) }}</span>
</template>

<style scoped>
.state-badge {
    position: relative;
    cursor: pointer;
}

.state-tip {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 20;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: max-content;
    margin-top: 4px;
    padding: 6px 8px;
    border: 1px solid var(--line);
    border-radius: 6px;
    background: var(--surface);
    color: var(--text);
    font-size: 12px;
    font-weight: 400;
    text-align: left;
    text-transform: none;
    box-shadow: 0 4px 14px rgb(0 0 0 / 18%);
}

.tip-failure {
    color: var(--danger);
}
</style>
