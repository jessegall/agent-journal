<script setup>
import Dot from "../kit/Dot.vue";
import Icon from "../kit/Icon.vue";
import PriorityIcon from "../kit/PriorityIcon.vue";
import {state, waitsOn} from "../domain/records.js";
import {age} from "../format/time.js";
import {meta} from "../state/store.js";
import {computed} from "vue";

const props = defineProps({resource: Object, selected: Boolean});

const held = computed(() => {
    if (props.resource.completed) return "";
    if (props.resource.data.blocked) return props.resource.data.blocked;
    const refs = waitsOn(props.resource);
    return refs.length ? `Waits on ${refs.map((ref) => "#" + ref.split(":")[1]).join(", ")}` : "";
});
</script>

<template>
    <button type="button" :class="['row', {selected, completed: resource.completed}]">
        <span class="glyph">
            <template v-if="meta(resource.type).start_as_count">
                <Dot :kind="state(resource)" />
            </template>
            <template v-else>
                <Icon :name="meta(resource.type).icon" :size="14" />
            </template>
        </span>
        <template v-if="meta(resource.type).fields.priority">
            <PriorityIcon :value="Number(resource.data.priority ?? 100)" />
        </template>
        <span class="n">#{{ resource.n }}</span>
        <span class="text">
            <span class="title">{{ resource.title }}</span>
            <template v-if="resource.abstract || resource.brief">
                <span class="abstract">
                    {{ resource.abstract || resource.brief.split("\n")[0] }}
                </span>
            </template>
        </span>
        <template v-if="held">
            <span class="held" :title="held">{{ held }}</span>
        </template>
        <span class="age">{{ age(resource.updated || resource.created) }}</span>
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
