<script setup>
import {computed} from "vue";
import MenuItem from "../kit/MenuItem.vue";
import MenuLabel from "../kit/MenuLabel.vue";
import PaneMenuInner from "../panes/PaneMenuInner.vue";
import PaneMenuOptions from "../panes/PaneMenuOptions.vue";
import {wordLabel} from "../domain/labels.js";

// one pane's menu in sections: what to do with the pane (split, detach, its width), the agent it follows, its window's options with the marks behind a fold,
// then moving it, closing it and resetting the layout; it is one narrow column that scrolls when it is long
const props = defineProps({
    pane: {type: Object, required: true},
    floats: {type: Boolean, default: false},
    followable: {type: Array, required: true},
    agentWindow: {type: Boolean, default: false},
    declared: {type: Array, required: true},
    others: {type: Array, required: true},
    canClose: {type: Boolean, default: false},
    canReset: {type: Boolean, default: false},
});
const emit = defineEmits(["split", "detach", "option", "move", "close", "reset"]);
const agents = computed(() => [{value: "main", agent: null, label: "Main agent", chosen: !props.pane.options?.agent},
    ...props.followable.map((row) => ({value: row.id, agent: row.id, label: `${wordLabel(row.role)} ${row.number}`, chosen: props.pane.options?.agent === row.id}))]);
</script>

<template>
<div class="pane-menu" role="menu">
    <MenuItem data-menu="split-right" :disabled="pane.tabs.length < 2" @click="emit('split', 'right')">Split right</MenuItem>
    <MenuItem data-menu="split-below" :disabled="pane.tabs.length < 2" @click="emit('split', 'bottom')">Split below</MenuItem>
    <template v-if="floats">
        <MenuItem data-menu="detach" @click="emit('detach')">Detach</MenuItem>
    </template>
    <MenuItem data-menu="width" @click="emit('option', 'width', pane.options?.width === 'contained' ? 'full' : 'contained')">{{ pane.options?.width === "contained" ? "Use full width" : "Limit width" }}</MenuItem>
    <template v-if="agentWindow">
        <PaneMenuInner option-key="agent" label="Agent" :items="agents" @pick="(item) => emit('option', 'agent', item.agent)" />
    </template>
    <PaneMenuOptions :declared="declared" :values="pane.options || {}" @set="(key, value) => emit('option', key, value)" />
    <template v-if="others.length">
        <MenuLabel>Move</MenuLabel>
    </template>
    <template v-for="other in others" :key="other.id">
        <MenuItem :data-menu="`move-${other.id}`" @click="emit('move', other.id)">Move to {{ other.title }}</MenuItem>
    </template>
    <div class="pane-menu-foot">
        <MenuItem data-menu="close" :disabled="!canClose" @click="emit('close')">Close</MenuItem>
        <template v-if="canReset">
            <MenuItem data-menu="reset" @click="emit('reset')">Reset layout</MenuItem>
        </template>
    </div>
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
    gap: 1px;
    box-sizing: border-box;
    width: 240px;
    max-height: min(70vh, 560px);
    padding: 4px;
    overflow-y: auto;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--raised);
    box-shadow: 0 8px 24px rgb(0 0 0 / 28%);
    scrollbar-width: thin;
}

.pane-menu :deep(.pane-menu-choice) {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    align-items: center;
    padding: 0 4px 6px;
}

.pane-menu :deep(.pane-menu-choice > .menu-label),
.pane-menu :deep(.pane-menu-choice > span:first-child) {
    flex-basis: 100%;
    padding: 10px 4px 2px;
    color: var(--text-4);
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
}

.pane-menu :deep(.pane-menu-group) {
    padding-left: 12px;
}

.pane-menu :deep(.pane-menu-main-only) {
    align-self: flex-start;
    margin: 0 0 2px 12px;
}

.pane-menu :deep(.pane-menu-fold) {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
    margin-top: 6px;
    padding: 6px 8px;
    border: 0;
    border-top: 1px solid var(--border);
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12px;
    text-align: left;
    cursor: pointer;
}

.pane-menu :deep(.pane-menu-fold:hover) {
    color: var(--text);
}

.pane-menu-foot {
    display: flex;
    flex-direction: column;
    margin-top: 6px;
    padding-top: 4px;
    border-top: 1px solid var(--border);
}
</style>
