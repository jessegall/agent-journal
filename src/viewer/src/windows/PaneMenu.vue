<script setup>
import Btn from "../kit/Btn.vue";
import PaneMenuOptions from "../panes/PaneMenuOptions.vue";

// one pane's menu: the color scheme, splitting, detaching, its width and agent, its window's options, moving and closing it
defineProps({
    pane: {type: Object, required: true},
    schemeLabel: {type: String, required: true},
    floats: {type: Boolean, default: false},
    followable: {type: Array, required: true},
    agentWindow: {type: Boolean, default: false},
    declared: {type: Array, required: true},
    others: {type: Array, required: true},
    canClose: {type: Boolean, default: false},
    canReset: {type: Boolean, default: false},
});
const emit = defineEmits(["scheme", "split", "detach", "option", "move", "close", "reset"]);
</script>

<template>
<div class="pane-menu" role="menu">
    <Btn data-menu="color-scheme" :title="`Color scheme: ${schemeLabel}`" @click="emit('scheme')">Color scheme: {{ schemeLabel }}</Btn>
    <Btn data-menu="split-right" :disabled="pane.tabs.length < 2" @click="emit('split', 'right')">Split right</Btn>
    <Btn data-menu="split-below" :disabled="pane.tabs.length < 2" @click="emit('split', 'bottom')">Split below</Btn>
    <template v-if="floats">
        <Btn data-menu="detach" @click="emit('detach')">Detach</Btn>
    </template>
    <Btn data-menu="width" @click="emit('option', 'width', pane.options?.width === 'contained' ? 'full' : 'contained')">{{ pane.options?.width === "contained" ? "Fill" : "Contain" }}</Btn>
    <template v-if="agentWindow">
        <div class="pane-menu-choice" data-option="agent">
            <span>Agent</span>
            <Btn data-choice="main" :aria-pressed="!pane.options?.agent" @click="emit('option', 'agent', null)">Main agent</Btn>
            <template v-for="row in followable" :key="row.id">
                <Btn :data-choice="row.id" :aria-pressed="pane.options?.agent === row.id" @click="emit('option', 'agent', row.id)">{{ row.role }} {{ row.id }}</Btn>
            </template>
        </div>
    </template>
    <PaneMenuOptions :declared="declared" :values="pane.options || {}" @set="(key, value) => emit('option', key, value)" />
    <template v-for="other in others" :key="other.id">
        <Btn :data-menu="`move-${other.id}`" @click="emit('move', other.id)">Move to {{ other.title }}</Btn>
    </template>
    <Btn data-menu="close" :disabled="!canClose" @click="emit('close')">Close</Btn>
    <template v-if="canReset">
        <Btn data-menu="reset" @click="emit('reset')">Reset layout</Btn>
    </template>
</div>
</template>

<style scoped>
.pane-menu {
    position: absolute;
    top: 34px;
    right: 5px;
    z-index: 6;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 6px;
    border: 1px solid var(--line);
    border-radius: 6px;
    background: var(--bg);
}
</style>
