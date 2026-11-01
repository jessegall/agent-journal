<script setup>
// the body of a docked plan, as version 4's plan card drew it: a chip with where the plan stands, which its dock type says
import {useWindow} from "@journal/window-kit";

// the dock item this card draws is the pane option "row"
const row = useWindow().option("row");
const STANDING = {"plans.waiting": "Waiting for you", "plans.started": "Started", "plans.paused": "Paused", "plans.done": "Done", "plans.cancelled": "Cancelled"};
</script>

<template>
    <div class="plan-dock">
        <template v-if="row">
            <span :class="['plan-dock-state', row.type.split('.')[1]]">{{ STANDING[row.type] }}</span>
        </template>
    </div>
</template>

<style scoped>
.plan-dock {
    display: flex;
    margin: 0 14px 10px 36px;
    gap: 8px;
    align-items: baseline;
    font-size: 12px;
    line-height: 1.45;
}

.plan-dock-state {
    flex: none;
    padding: 1px 8px;
    margin-left: -8px;
    border-radius: 9px;
    background: var(--raised);
    color: var(--text-2);
}

.plan-dock-state.started {
    background: var(--accent-dim);
    color: var(--accent-text);
}

.plan-dock-state.waiting {
    background: color-mix(in srgb, var(--warn, #d9a441) 22%, transparent);
    color: var(--warn, #d9a441);
}

.plan-dock-state.cancelled,
.plan-dock-state.paused {
    color: var(--text-3);
}

.plan-dock-text {
    min-width: 0;
    color: var(--text-3);
}
</style>
