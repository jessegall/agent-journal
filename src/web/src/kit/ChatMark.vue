<script setup>
import {computed, useAttrs} from "vue";
import ChatMarkStatus from "./ChatMarkStatus.vue";
import Icon from "./Icon.vue";
import TextDisplay from "./TextDisplay.vue";
import {clock} from "../format/time.js";

const props = defineProps({mark: {type: Object, required: true}});

const attrs = useAttrs();
const tag = computed(() => (attrs.onClick ? "button" : "span"));
const shade = computed(() => props.mark.color || (props.mark.tone ? `var(--tone-${props.mark.tone})` : ""));
const hover = computed(() => [props.mark.title, props.mark.at ? clock(props.mark.at) : ""].filter(Boolean).join(" · "));
const tint = computed(() => ({
    ...(shade.value ? {"--mark": shade.value} : {}),
    ...(props.mark.depth ? {"--depth": props.mark.depth} : {}),
}));
</script>

<template>
    <component
        :is="tag"
        :type="tag === 'button' ? 'button' : undefined"
        :class="['mark', {tinted: shade, console: mark.command, nested: mark.depth > 0, [`ended-${mark.state}`]: mark.ended}]"
        :style="tint"
        :title="hover"
    >
        <Icon :name="mark.icon || 'dot'" />
        <span class="head">
            <TextDisplay :text="mark.label" inline />
            <template v-if="mark.name">
                <strong>{{ mark.name }}</strong>
            </template>
            <template v-if="mark.state || mark.started">
                <ChatMarkStatus :mark="mark" />
            </template>
        </span>
        <template v-if="mark.detail">
            <TextDisplay class="detail" :text="mark.detail" inline />
        </template>
        <template v-if="mark.command">
            <code class="detail command" :title="mark.command">{{ mark.command }}</code>
        </template>
        <template v-if="mark.card">
            <TextDisplay class="card" :text="mark.card" />
        </template>
    </component>
</template>

<style scoped>
.mark.nested {
    position: relative;
    margin-left: calc(var(--depth) * 16px);
}

.mark.nested::before {
    content: "";
    position: absolute;
    top: 2px;
    bottom: 2px;
    left: -9px;
    width: 2px;
    border-radius: 1px;
    background: var(--mark, var(--border-3));
    opacity: 0.7;
}

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
    flex-wrap: wrap;
    align-items: baseline;
    gap: 5px;
    min-width: 0;
    overflow-wrap: anywhere;
}

.mark.console .head {
    margin: 0 -9px;
    padding: 0 9px 3px;
    border-bottom: 1px solid var(--border-2);
}

.mark.ended-done {
    border-color: color-mix(in srgb, var(--tone-good) 40%, var(--border-2));
    background: color-mix(in srgb, var(--tone-good) 7%, transparent);
}

.mark.ended-failed {
    border-color: color-mix(in srgb, var(--danger) 55%, var(--border-2));
    background: color-mix(in srgb, var(--danger) 9%, transparent);
}

.head :deep(.md) {
    color: inherit;
    line-height: inherit;
}

.mark .head :deep(code) {
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    padding: 0 6px;
    text-overflow: ellipsis;
    vertical-align: bottom;
    white-space: nowrap;
    border: 1px solid color-mix(in srgb, var(--mark, var(--border-3)) 45%, transparent);
    border-radius: 999px;
    background: color-mix(in srgb, var(--mark, var(--border-3)) 14%, transparent);
    color: var(--text-2);
    font-size: 10.5px;
}

.head strong {
    color: var(--text-2);
    font-weight: 500;
}

.mark .detail :deep(.row-pill) {
    font-family: inherit;
    line-height: inherit;
}

.mark .detail :deep(.row-pill .ico) {
    width: 10px;
    height: 10px;
}

.mark .command {
    min-width: 0;
    overflow: hidden;
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.mark .card {
    grid-column: 1 / -1;
    font-size: 13px;
}

.mark .card :deep(.row-card) {
    margin: 5px 0 2px;
}

.mark .detail {
    grid-column: 1 / -1;
    color: color-mix(in srgb, var(--text-3) 80%, transparent);
    font-size: 10px;
    line-height: 1.4;
    overflow-wrap: anywhere;
}
</style>
