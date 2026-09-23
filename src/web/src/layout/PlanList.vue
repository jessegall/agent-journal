<script setup>
import {ref} from "vue";
import Btn from "../kit/Btn.vue";
import Chip from "../kit/Chip.vue";
import Icon from "../kit/Icon.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import {approvePlan, parkPlan, startPlan} from "../actions/plans.js";
import {useOutside} from "../composables/outside.js";
import {usePlanRows} from "../composables/planRows.js";
import {peek} from "../route.js";
import {rows} from "../sync/rows.js";
import {PLAN_STATES, sizeOf, stoppedOf} from "./statusline.js";

const props = defineProps({plans: Array, running: Boolean, up: Boolean, anchor: {type: Object, default: null}});
const emit = defineEmits(["close"]);
const menu = ref(null);
const error = ref("");
useOutside(menu, () => emit("close"));
usePlanRows(() => props.plans);

function open(p) {
    emit("close");
    peek("plan", p.n);
}

async function run(action, p) {
    error.value = "";
    try {
        await action(p);
    } catch (e) {
        error.value = e.message;
    }
}
</script>

<template>
    <div :class="['plan-list', {up}]">
        <MenuPanel ref="menu" :anchor="anchor" @click.stop @close="emit('close')">
            <div class="plan-list-body">
                <p class="plan-list-head">Other plans</p>
                <template v-for="p in plans" :key="p.n">
                    <div class="plan-list-row">
                        <Icon name="plan" class="plan-list-icon" />
                        <div class="plan-list-words">
                            <button type="button" class="plan-list-name" title="Open plan" @click="open(p)">{{ p.title }}</button>
                            <span class="plan-list-sub">
                                <Chip class="plan-list-chip" :tone="p.data.status === 'ready' ? 'accent' : ''">
                                    {{ PLAN_STATES[p.data.status] }}
                                </Chip>
                                <span>{{ p.data.status === "parked" ? stoppedOf(p, rows("todo")) : sizeOf(p) }}</span>
                            </span>
                        </div>
                        <span class="plan-list-acts">
                            <template v-if="p.data.status === 'approved'">
                                <Btn small @click="run(parkPlan, p)">Park</Btn>
                            </template>
                            <template v-if="p.data.status === 'ready'">
                                <Btn small @click="run(approvePlan, p)">Start</Btn>
                            </template>
                            <template v-if="p.data.status === 'parked'">
                                <Btn small @click="run(startPlan, p)">Resume</Btn>
                            </template>
                        </span>
                    </div>
                </template>
                <p class="plan-list-hint">{{ running ? "Starting a plan parks the one that runs." : "One plan runs at a time." }}</p>
                <template v-if="error">
                    <p class="plan-list-error">{{ error }}</p>
                </template>
            </div>
        </MenuPanel>
    </div>
</template>

<style scoped>
.plan-list {
    display: contents;
}

.plan-list :deep(.menu-panel:not(.anchored)) {
    right: 0;
    top: calc(100% + 6px);
}

.plan-list.up :deep(.menu-panel:not(.anchored)) {
    top: auto;
    bottom: calc(100% + 6px);
}

.plan-list-body {
    width: 348px;
    max-width: calc(100vw - 36px);
}

.plan-list-head {
    margin: 0;
    padding: 5px 8px 6px;
    color: var(--text-3);
    font-size: 11px;
}

.plan-list-row {
    display: grid;
    grid-template-columns: 16px minmax(0, 1fr) auto;
    align-items: center;
    column-gap: 10px;
    padding: 8px 6px 8px 8px;
    border-radius: 7px;
}

.plan-list-row:hover {
    background: var(--hover);
}

.plan-list-icon {
    align-self: start;
    margin-top: 1px;
    color: var(--text-3);
}

.plan-list-words {
    min-width: 0;
}

.plan-list-name {
    display: block;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text);
    font: inherit;
    font-weight: 500;
    line-height: 1.35;
    text-align: left;
    text-wrap: pretty;
    cursor: pointer;
}

.plan-list-name:hover {
    text-decoration: underline;
    text-decoration-color: var(--text-4);
    text-underline-offset: 3px;
}

.plan-list-sub {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 8px;
    margin-top: 5px;
    color: var(--text-4);
    font-size: 11.5px;
}

.plan-list-chip {
    align-self: center;
}

.plan-list-acts {
    display: flex;
    gap: 4px;
}

.plan-list-hint {
    margin: 4px 0 0;
    padding: 8px 8px 4px;
    border-top: 1px solid var(--border);
    color: var(--text-4);
    font-size: 11.5px;
}

.plan-list-error {
    margin: 0;
    padding: 4px 8px;
    color: var(--danger);
    font-size: 11.5px;
}
</style>
