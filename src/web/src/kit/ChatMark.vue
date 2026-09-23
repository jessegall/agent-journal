<script setup>
import {computed, useAttrs} from "vue";
import Icon from "./Icon.vue";
import TextDisplay from "./TextDisplay.vue";
import {clock} from "../format/time.js";

const props = defineProps({
    icon: {type: String, default: "dot"},
    color: {type: String, default: ""},
    tone: {type: String, default: ""},
    label: {type: String, required: true},
    name: {type: String, default: ""},
    at: {type: Number, default: 0},
    detail: {type: String, default: ""},
    title: {type: String, default: ""},
});

const attrs = useAttrs();
const tag = computed(() => (attrs.onClick ? "button" : "span"));
const shade = computed(() => props.color || (props.tone ? `var(--tone-${props.tone})` : ""));
const hover = computed(() => [props.title, props.at ? clock(props.at) : ""].filter(Boolean).join(" · "));
const tint = computed(() => (shade.value ? {"--mark": shade.value} : {}));
</script>

<template>
    <component :is="tag" :type="tag === 'button' ? 'button' : undefined" :class="['mark', {tinted: shade}]" :style="tint" :title="hover">
        <Icon :name="icon" />
        <span class="head">
            {{ label }}
            <template v-if="name">
                <strong>{{ name }}</strong>
            </template>
        </span>
        <template v-if="detail">
            <TextDisplay class="detail" :text="detail" inline />
        </template>
    </component>
</template>

<style scoped>
.mark {
    display: inline-grid;
    grid-template-columns: auto minmax(0, 1fr);
    column-gap: 6px;
    row-gap: 1px;
    align-items: center;
    max-width: 100%;
    padding: 3px 9px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 11px;
    line-height: 1.4;
    text-align: left;
}

button.mark {
    cursor: pointer;
}

button.mark:hover {
    color: var(--text-2);
}

.mark.tinted {
    border-color: color-mix(in srgb, var(--mark) 35%, transparent);
    background: color-mix(in srgb, var(--mark) 7%, transparent);
}

.mark .ico {
    width: 12px;
    height: 12px;
}

.mark.tinted .ico {
    color: var(--mark);
}

.head {
    display: flex;
    gap: 5px;
    white-space: nowrap;
}


.head strong {
    color: var(--text-2);
    font-weight: 500;
}

.mark .detail :deep(.row-pill) {
    padding: 0 5px;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
}

.mark .detail :deep(.row-pill .ico) {
    width: 10px;
    height: 10px;
}

.mark .detail {
    grid-column: 2;
    overflow: hidden;
    color: color-mix(in srgb, var(--text-3) 80%, transparent);
    font-size: 10px;
    line-height: 1.4;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
