<script setup>
import Icon from "./Icon.vue";
import StateDot from "./StateDot.vue";

defineProps({
    label: {type: String, required: true},
    note: {type: String, default: ""},
    icon: {type: String, default: ""},
    state: {type: String, default: null},
    hint: {type: String, default: ""},
    badge: {type: String, default: ""},
    badgeIcon: {type: String, default: ""},
    live: Boolean,
    faded: Boolean,
    outside: Boolean,
    fold: Boolean,
    still: Boolean,
    lit: Boolean,
});
</script>

<template>
    <button
        type="button"
        :class="['graph-node', {live, faded, outside, fold, still, lit}]"
        :title="hint || label"
        :tabindex="still ? -1 : 0"
    >
        <template v-if="state !== null">
            <StateDot :state="state" />
        </template>
        <template v-if="icon">
            <Icon :name="icon" :size="12" />
        </template>
        <span class="graph-label">{{ label }}</span>
        <template v-if="note">
            <span class="graph-note">{{ note }}</span>
        </template>
        <template v-if="badge">
            <span class="graph-badge">
                <template v-if="badgeIcon">
                    <Icon :name="badgeIcon" :size="11" />
                </template>
                {{ badge }}
            </span>
        </template>
    </button>
</template>

<style scoped>
.graph-node {
    display: flex;
    align-items: center;
    gap: 7px;
    min-width: 0;
    padding: 0 10px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--bg-2);
    font: inherit;
    font-size: 12px;
    color: var(--text);
    text-align: left;
    white-space: nowrap;
    cursor: pointer;
    transition:
        border-color 0.15s,
        background 0.15s,
        opacity 0.15s;
}

.graph-node :deep(.ico) {
    flex: none;
    color: var(--text-3);
}

.graph-node:hover,
.graph-node.lit {
    border-color: var(--border-3);
    background: var(--raised);
    opacity: 1;
}

.graph-node:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 1px;
}

.graph-label {
    flex: 0 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;
}

.graph-note {
    flex: 1 1 0;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--text-3);
}

.graph-badge {
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 3px;
    margin-left: auto;
    font-size: 11px;
    color: var(--text-3);
}

.graph-node.live {
    border-color: color-mix(in srgb, var(--progress) 55%, transparent);
    background: color-mix(in srgb, var(--progress) 10%, var(--bg-2));
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--progress) 12%, transparent);
}

.graph-node.faded {
    opacity: 0.5;
}

.graph-node.faded .graph-label {
    font-weight: 400;
    color: var(--text-2);
}

.graph-node.outside {
    border-style: dashed;
    background: transparent;
}

.graph-node.outside .graph-label {
    font-weight: 400;
    color: var(--text-2);
}

.graph-node.fold {
    border-style: dashed;
    background: transparent;
    color: var(--text-2);
}

.graph-node.fold .graph-label {
    font-weight: 400;
}

.graph-node.still {
    cursor: default;
}

@media (prefers-reduced-motion: reduce) {
    .graph-node {
        transition: none;
    }
}
</style>
