<script setup>
defineProps({
    title: {type: String, required: true},
    line: {type: String, default: ""},
    keys: {type: String, default: ""},
    side: {type: String, default: "below"},
    arrow: {type: String, default: "50%"},
});
</script>

<template>
    <span :class="['tip', side]" :style="{'--arrow-x': arrow}">
        <span class="tip-title">
            <span>{{ title }}</span>
            <template v-if="keys">
                <kbd class="tip-keys">{{ keys }}</kbd>
            </template>
        </span>
        <template v-if="line">
            <span class="tip-line">{{ line }}</span>
        </template>
        <span class="tip-arrow" />
    </span>
</template>

<style scoped>
.tip {
    display: block;
    width: max-content;
    max-width: min(280px, calc(100vw - 16px));
    padding: 7px 10px 8px;
    border: 1px solid var(--tip-edge);
    border-radius: 7px;
    background: var(--tip-bg);
    box-shadow: var(--tip-shadow);
    font-size: 12px;
    line-height: 1.4;
    text-align: left;
}

.tip-title {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    color: var(--text);
    font-weight: 600;
}

.tip-line {
    display: block;
    margin-top: 2px;
    color: var(--text-2);
    text-wrap: pretty;
}

.tip-keys {
    flex: none;
    padding: 0 4px;
    border: 1px solid var(--border-3);
    border-radius: 4px;
    color: var(--text-3);
    font-family: var(--mono);
    font-size: 10.5px;
    font-weight: 500;
}

.tip-arrow {
    position: absolute;
    left: var(--arrow-x);
    width: 9px;
    height: 9px;
    margin-left: -4.5px;
    background: var(--tip-bg);
    transform: rotate(45deg);
}

.below .tip-arrow {
    top: -5px;
    border-top: 1px solid var(--tip-edge);
    border-left: 1px solid var(--tip-edge);
}

.above .tip-arrow {
    bottom: -5px;
    border-right: 1px solid var(--tip-edge);
    border-bottom: 1px solid var(--tip-edge);
}

.tip.sliding .tip-arrow {
    transition: left 120ms var(--ease);
}

@media (prefers-reduced-motion: reduce) {
    .tip.sliding .tip-arrow {
        transition: none;
    }
}
</style>
