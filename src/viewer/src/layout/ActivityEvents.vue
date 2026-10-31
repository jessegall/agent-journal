<script setup>
import {store} from "../state/store.js";
import {counted, useActivity} from "../composables/activity.js";
import TextDisplay from "../kit/TextDisplay.vue";
import {onMounted, ref, toRef} from "vue";
import {peek} from "../route.js";
import {byRef} from "../domain/records.js";
import {atOf, isRowChange} from "../domain/entries.js";
import {age} from "../format/time.js";

const settled = ref(false);
onMounted(() => setTimeout(() => (settled.value = true), 400));
const {items, unfold, expanded, toggle, heading, title, who} = useActivity(toRef(store, "entries"), byRef);
</script>

<template>
    <TransitionGroup tag="div" class="activity-list" :name="settled ? 'act' : ''">
        <template v-for="item in items" :key="item.key">
            <template v-if="item.fold">
                <button type="button" class="activity-row activity-fold" @click="unfold(item.key)">
                    <span class="activity-text">{{ counted(item.fold.entries) }}</span>
                    <span class="activity-age">{{ age(atOf(item.fold.entries[0])) || "just now" }}</span>
                </button>
            </template>
            <template v-else>
                <div :class="['activity-row', 'activity-link', {'activity-nested': item.nested, 'activity-open': expanded(item.entry)}]" @click="toggle(item.entry)">
                    <span class="activity-text">
                        {{ heading(item.entry) }}
                        <template v-if="isRowChange(item.entry) && item.entry.entry_type !== 'deleted'">
                            <a class="activity-n" href="#" @click.prevent.stop="peek(item.entry.data.table, item.entry.data.id)">{{ item.entry.data.id }}</a>
                        </template>
                    </span>
                    <template v-if="expanded(item.entry) && title(item.entry)">
                        <TextDisplay inline class="activity-title" :text="title(item.entry)" />
                    </template>
                    <span class="activity-age">{{ who(item.entry) }} · {{ age(atOf(item.entry)) || "just now" }}<template v-if="item.entry.data && item.entry.data.hook_ms !== undefined"> · {{ item.entry.data.hook_ms }} ms</template></span>
                </div>
            </template>
        </template>
    </TransitionGroup>
</template>

<style scoped>
.activity-fold {
    width: 100%;
    border: 0;
    background: none;
    text-align: left;
    font: inherit;
    cursor: pointer;
}

.activity-fold .activity-text {
    color: var(--text-3);
}

.activity-nested {
    padding-left: 18px;
}

.tone-warn .activity-text,
.tone-good .activity-text {
    color: var(--tone);
}

.activity-list {
    position: relative;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 8px 0 12px;
}

.activity-row {
    display: flex;
    flex-direction: column;
    gap: 1px;
    padding: 5px 8px;
}

.activity-text {
    font-size: 12px;
    color: var(--text-2);
    line-height: 1.45;
    overflow-wrap: anywhere;
}

.activity-title {
    font-size: 11.5px;
    color: var(--text-3);
    line-height: 1.4;
    overflow-wrap: anywhere;
}

.activity-age {
    font-size: 11px;
    color: var(--text-3);
    white-space: nowrap;
    opacity: 0.8;
}

.activity-link {
    color: inherit;
    border-radius: 7px;
    cursor: pointer;
}

a.activity-n {
    color: inherit;
    text-decoration: none;
}

a.activity-n:hover {
    color: var(--accent-text);
    opacity: 1;
}

.activity-link:hover {
    background: var(--hover);
}

.activity-link:hover .activity-text {
    color: var(--text);
}

.activity-n {
    margin-left: 0.35em;
    font-size: 10.5px;
    color: var(--text-3);
    opacity: 0.65;
    font-variant-numeric: tabular-nums;
}

.activity-n::before {
    content: "·";
    margin-right: 0.35em;
}
</style>
