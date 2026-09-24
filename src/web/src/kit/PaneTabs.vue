<script setup>
import Icon from "./Icon.vue";

defineProps({tabs: {type: Array, required: true}, insertAt: {type: Number, default: -1}});
const emit = defineEmits(["pick", "close", "grab"]);
</script>

<template>
    <div class="pane-tabs">
        <div class="pane-tabs-row" role="tablist">
            <template v-for="(t, i) in tabs" :key="t.key">
                <div
                    role="tab"
                    tabindex="0"
                    :title="t.title"
                    :aria-selected="t.on"
                    :class="[
                        'pane-tab',
                        {
                            on: t.on,
                            lifting: t.lifting,
                            'insert-before': insertAt === i,
                            'insert-after': insertAt === tabs.length && i === tabs.length - 1,
                        },
                    ]"
                    :data-tab="t.key"
                    @pointerdown="emit('grab', $event, t.key)"
                    @keydown.enter.prevent="emit('pick', t.key)"
                    @keydown.space.prevent="emit('pick', t.key)"
                >
                    <Icon :name="t.icon" :size="13" />
                    <span class="pane-tab-label">{{ t.title }}</span>
                    <template v-if="t.count !== undefined">
                        <span :class="['pane-tab-n', {hot: t.hot}]">{{ t.count }}</span>
                    </template>
                    <button
                        type="button"
                        class="pane-tab-x"
                        :title="`Close ${t.title}`"
                        @pointerdown.stop
                        @click.stop="emit('close', t.key)"
                    >
                        <Icon name="x" :size="10" />
                    </button>
                </div>
            </template>
        </div>
        <slot />
    </div>
</template>

<style scoped>
.pane-tabs {
    flex: none;
    display: flex;
    align-items: stretch;
    gap: 8px;
    height: 34px;
    padding: 0 5px 0 14px;
    border-bottom: 1px solid var(--border);
    background: #111215;
}

.pane-tabs-row {
    flex: 1;
    min-width: 0;
    display: flex;
    gap: 12px;
    overflow: hidden;
}

.pane-tab {
    position: relative;
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11.5px;
    letter-spacing: 0.03em;
    color: var(--text-3);
    white-space: nowrap;
    cursor: pointer;
    touch-action: none;
    transition:
        color 0.15s,
        box-shadow 0.2s,
        opacity 0.15s;
}

.pane-tab:hover {
    color: var(--text-2);
}

.pane-tab:focus-visible {
    outline: 1px solid var(--accent);
    outline-offset: -1px;
}

.pane-tab.on {
    color: var(--text);
    box-shadow: inset 0 -1px 0 var(--accent);
}

.pane-tab.lifting {
    opacity: 0.4;
}

.pane-tab :deep(.ico) {
    color: inherit;
}

.pane-tab-n {
    font-size: 11px;
    color: var(--text-3);
    font-variant-numeric: tabular-nums;
}

.pane-tab.on .pane-tab-n,
.pane-tab-n.hot {
    color: var(--accent-text);
}

.pane-tab.insert-before::before,
.pane-tab.insert-after::after {
    content: "";
    position: absolute;
    top: 7px;
    bottom: 7px;
    width: 2px;
    border-radius: 1px;
    background: var(--accent);
}

.pane-tab.insert-before::before {
    left: -7px;
}

.pane-tab.insert-after::after {
    right: -7px;
}

.pane-tab-x {
    display: grid;
    place-items: center;
    width: 0;
    height: 14px;
    margin-left: -6px;
    padding: 0;
    overflow: hidden;
    border: 0;
    border-radius: 4px;
    background: none;
    color: var(--text-4);
    opacity: 0;
    cursor: pointer;
    transition:
        width 0.15s var(--ease),
        margin 0.15s var(--ease),
        opacity 0.15s,
        background 0.15s,
        color 0.15s;
}

.pane-tab:hover .pane-tab-x,
.pane-tab:focus-visible .pane-tab-x,
.pane-tab-x:focus-visible {
    width: 14px;
    margin-left: -2px;
    opacity: 1;
}

.pane-tab:hover .pane-tab-x {
    transition-delay: 0.5s, 0.5s, 0.5s, 0s, 0s;
}

.pane-tab-x:hover {
    background: var(--hover);
    color: var(--text);
}

@container (max-width: 480px) {
    .pane-tab:not(.on) .pane-tab-label,
    .pane-tab:not(.on) .pane-tab-x {
        display: none;
    }
}
</style>
