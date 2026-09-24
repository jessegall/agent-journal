<script setup>
import StateDot from "./StateDot.vue";
import {computed, onUnmounted, ref, useAttrs, watchEffect} from "vue";
import Icon from "./Icon.vue";
import TextDisplay from "./TextDisplay.vue";
import {clock, stopwatch} from "../format/time.js";

const props = defineProps({
    icon: {type: String, default: "dot"},
    color: {type: String, default: ""},
    tone: {type: String, default: ""},
    label: {type: String, required: true},
    name: {type: String, default: ""},
    at: {type: Number, default: 0},
    detail: {type: String, default: ""},
    card: {type: String, default: ""},
    command: {type: String, default: ""},
    title: {type: String, default: ""},
    state: {type: String, default: ""},
    started: {type: Number, default: 0},
    ended: {type: Number, default: 0},
});

const attrs = useAttrs();
const tag = computed(() => (attrs.onClick ? "button" : "span"));
const shade = computed(() => props.color || (props.tone ? `var(--tone-${props.tone})` : ""));
const hover = computed(() => [props.title, props.at ? clock(props.at) : ""].filter(Boolean).join(" · "));
const tint = computed(() => (shade.value ? {"--mark": shade.value} : {}));
const now = ref(Date.now() / 1000);
let ticking = 0;
watchEffect(() => {
    clearInterval(ticking);
    if (props.started && !props.ended) ticking = setInterval(() => (now.value = Date.now() / 1000), 1000);
});
onUnmounted(() => clearInterval(ticking));
const took = computed(() => {
    if (!props.started) return "";
    return props.ended ? `ran ${stopwatch(props.ended - props.started)}` : stopwatch(now.value - props.started);
});
</script>

<template>
    <component
        :is="tag"
        :type="tag === 'button' ? 'button' : undefined"
        :class="['mark', {tinted: shade, console: command, [`ended-${state}`]: ended}]"
        :style="tint"
        :title="hover"
    >
        <Icon :name="icon" />
        <span class="head">
            <TextDisplay :text="label" inline />
            <template v-if="name">
                <strong>{{ name }}</strong>
            </template>
            <template v-if="state || took">
                <span class="status">
                    <template v-if="took">
                        <span class="took">{{ took }}</span>
                    </template>
                    <template v-if="state">
                        <StateDot :state="state" :title="{done: 'Ended', failed: 'Failed'}[state] || 'Still running'" />
                    </template>
                </span>
            </template>
        </span>
        <template v-if="detail">
            <TextDisplay class="detail" :text="detail" inline />
        </template>
        <template v-if="command">
            <code class="detail command">{{ command }}</code>
        </template>
        <template v-if="card">
            <TextDisplay class="card" :text="card" />
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
    flex-wrap: wrap;
    align-items: baseline;
    gap: 5px;
    min-width: 0;
    overflow-wrap: anywhere;
}

.mark.console .head {
    padding-bottom: 3px;
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

.took {
    font-size: 10px;
}

.status {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin-left: auto;
    padding-left: 6px;
    color: var(--text-4);
    font-variant-numeric: tabular-nums;
}

.head :deep(.md) {
    color: inherit;
    line-height: inherit;
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
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
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
