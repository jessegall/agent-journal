<script setup>
import {computed} from "vue";
import {VALUE_KEYS} from "../domain/chartCard.js";
import MenuItem from "../kit/MenuItem.vue";
import MenuLabel from "../kit/MenuLabel.vue";
import TextInput from "../kit/TextInput.vue";

const props = defineProps({
    search: {type: String, required: true},
    landing: {type: String, required: true},
    triggers: {type: Array, required: true},
    checks: {type: Array, required: true},
    actions: {type: Array, required: true},
    hasTrigger: {type: Boolean, default: false},
    described: {type: Function, required: true},
});
const emit = defineEmits(["search", "add"]);

// the steps on a workflow's own counts and times are a group of their own, so a count or a clock is found where it is looked for
const isValue = (entry) => VALUE_KEYS.includes(entry.key);
const groups = computed(() => [
    {kind: "trigger", label: "Triggers", note: "", entries: props.triggers},
    {kind: "check", label: "Checks", note: "— a yes or no question", entries: props.checks.filter((e) => !isValue(e))},
    {kind: "action", label: "Actions", note: "— something the workflow does", entries: props.actions.filter((e) => !isValue(e))},
    {kind: "value", label: "Counts and times", note: "— what the workflow keeps between events", entries: [...props.actions, ...props.checks].filter(isValue)},
]);
</script>

<template>
    <TextInput
        class="chart-search"
        icon="search"
        :value="search"
        placeholder="Search nodes"
        autofocus
        @input="emit('search', $event.target.value)"
    />
    <p class="chart-landing">{{ landing }}</p>
    <template v-for="group in groups" :key="group.kind">
        <MenuLabel>
            {{ group.label }}
            <template v-if="group.note">
                <span class="chart-label-note">{{ group.note }}</span>
            </template>
        </MenuLabel>
        <template v-if="group.kind === 'trigger' && hasTrigger">
            <p class="chart-menu-about">A trigger for another event makes this workflow answer that event too, sharing its counts and times.</p>
        </template>
        <template v-for="entry in group.entries" :key="`${group.kind}:${entry.key}`">
            <MenuItem :description="described(entry)" @click="emit('add', entry)">
                <span :class="['chart-glyph', entry.kind]" />
                {{ entry.title }}
            </MenuItem>
        </template>
    </template>
</template>

<style scoped>
.chart-search {
    margin: 2px 2px 6px;
}

.chart-landing {
    margin: 0 2px 4px;
    padding: 6px 8px;
    border-radius: 6px;
    background: var(--bg-2);
    color: var(--text-3);
    font-size: 11.5px;
}

.chart-menu-about {
    margin: 0;
    padding: 0 8px 4px;
    color: var(--text-4);
    font-size: 11.5px;
}

.chart-label-note {
    font-weight: 400;
    letter-spacing: 0;
    text-transform: none;
}

.chart-glyph {
    display: inline-block;
    flex: none;
    width: 7px;
    height: 7px;
    margin-right: 8px;
    border-radius: 50%;
    background: var(--text-3);
}

.chart-glyph.check {
    width: 6px;
    height: 6px;
    margin: 0 8px 0 0.5px;
    border-radius: 1px;
    transform: rotate(45deg);
}

.chart-glyph.action {
    width: 6px;
    height: 6px;
    margin: 0 8px 0 0.5px;
    border-radius: 1.5px;
}
</style>
