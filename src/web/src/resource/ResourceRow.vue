<script setup>
import {meta} from "../domain/tables.js";
import TextDisplay from "../kit/TextDisplay.vue";
import Dot from "../kit/Dot.vue";
import Icon from "../kit/Icon.vue";
import {state} from "../domain/records.js";
import {bodyOf, closedAt, isClosed, titleOf, updatedAt} from "../domain/row.js";
import {age, ago} from "../format/time.js";
import {computed} from "vue";
import {sentence} from "../domain/triggerWords.js";

const props = defineProps({resource: Object, selected: Boolean});
const held = computed(() => {
    if (isClosed(props.resource)) return "";
    if (props.resource.blocked_why) return `Blocked: ${props.resource.blocked_why}`;
    return props.resource.parked_why ? `Parked: ${props.resource.parked_why}` : "";
});
const summary = computed(() => (props.resource.table === "triggers" ? sentence(props.resource) : props.resource.abstract || bodyOf(props.resource)));
</script>

<template>
    <button type="button" :class="['row', {selected, completed: isClosed(resource)}]">
        <span class="glyph">
            <template v-if="meta(resource.table).start_as_count">
                <Dot :kind="state(resource)" />
            </template>
            <template v-else>
                <Icon :name="meta(resource.table).icon" :size="14" />
            </template>
        </span>
        <span class="n">#{{ resource.id }}</span>
        <span class="text">
            <span class="title">{{ titleOf(resource) }}</span>
            <template v-if="summary && summary !== titleOf(resource)">
                <span class="abstract">
                    <TextDisplay inline :text="summary.slice(0, 300)" />
                </span>
            </template>
        </span>
        <template v-if="held">
            <span class="held" :title="held">{{ held }}</span>
        </template>
        <span class="age">{{ isClosed(resource) ? `Closed ${ago(closedAt(resource))}` : age(updatedAt(resource)) }}</span>
    </button>
</template>

<style scoped>
.row {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 9px 22px;
    border: 0;
    border-top: 1px solid var(--border);
    background: none;
    text-align: left;
    cursor: pointer;
}
.row:hover {
    background: var(--hover);
}
.row.selected {
    background: var(--sel);
}
.row.completed .title {
    color: var(--text-3);
    text-decoration: line-through;
}
.glyph {
    color: var(--accent-text);
    display: inline-flex;
}
.n {
    color: var(--text-3);
    font-variant-numeric: tabular-nums;
    width: 36px;
}
.text {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
}
.title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.abstract {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--text-3);
    font-size: 12.5px;
}
.held {
    flex-shrink: 0;
    padding: 1px 7px;
    border: 1px solid var(--border);
    border-radius: 10px;
    color: var(--text-2);
    font-size: 11.5px;
    white-space: nowrap;
    max-width: 240px;
    overflow: hidden;
    text-overflow: ellipsis;
}
.age {
    color: var(--text-3);
    font-size: 12px;
}
</style>
