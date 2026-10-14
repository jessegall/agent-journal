<script setup>
import {computed} from "vue";
import Icon from "../../kit/Icon.vue";

const props = defineProps({
    label: {type: String, required: true},
    sub: {type: String, default: ""},
    icon: {type: String, default: ""},
    count: {type: [Number, String], default: ""},
    hot: {type: Boolean, default: false},
    tone: {type: String, default: ""},
    chevron: {type: Boolean, default: true},
    still: {type: Boolean, default: false},
    indent: {type: Number, default: 0},
});
const emit = defineEmits(["pick"]);
const tag = computed(() => (props.still ? "div" : "button"));
</script>

<template>
    <component :is="tag" :type="still ? undefined : 'button'" :class="['cell', tone]" @click="still || emit('pick')">
        <template v-if="indent">
            <span class="cell-indent" :style="{width: `${indent * 18}px`}" aria-hidden="true" />
        </template>
        <template v-if="icon">
            <span class="cell-ic" aria-hidden="true"><Icon :name="icon" :size="18" /></span>
        </template>
        <slot name="lead" />
        <span class="cell-main">
            <span class="cell-title">{{ label }}</span>
            <template v-if="sub">
                <span class="cell-sub">{{ sub }}</span>
            </template>
            <slot />
        </span>
        <template v-if="count !== ''">
            <span :class="['cell-count', {hot}]">{{ count }}</span>
        </template>
        <slot name="end">
            <template v-if="!still && chevron">
                <Icon name="chevronRight" :size="14" class="cell-chev" />
            </template>
        </slot>
    </component>
</template>

<style scoped>
.cell {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    max-width: none;
    min-height: 48px;
    padding: 10px 14px;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    text-align: left;
}

.cell + .cell::before,
:deep(.swipe) + .cell::before,
.cell + :deep(.swipe)::before {
    content: "";
    position: absolute;
    top: 0;
    left: 14px;
    right: 0;
    z-index: 2;
    border-top: 1px solid var(--line);
}

button.cell:active {
    background: var(--hover);
}

.cell-indent {
    flex: none;
    margin-right: -12px;
}

.cell-ic {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background: var(--sel);
    color: var(--text-2);
}

.cell-main {
    flex: 1;
    min-width: 0;
}

.cell-title {
    display: block;
    font-size: 1.0625rem;
    line-height: 1.3;
}

.cell-sub {
    display: block;
    margin-top: 2px;
    color: var(--text-3);
    font-size: 0.875rem;
    line-height: 1.3;
}

.cell-count {
    color: var(--text-3);
    font-size: 1rem;
    font-variant-numeric: tabular-nums;
}

.cell-count.hot {
    min-width: 22px;
    padding: 1px 7px;
    border-radius: 11px;
    background: var(--accent);
    color: #fff;
    font-size: 0.875rem;
    font-weight: 600;
    text-align: center;
}

.cell-chev {
    flex: none;
    color: var(--text-3);
}

.cell.danger .cell-title {
    color: var(--danger);
}

.cell.accent .cell-title {
    color: var(--accent-text);
}
</style>
