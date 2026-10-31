<script setup>
import {meta} from "../domain/tables.js";
import {startWords} from "../domain/sequenceTriggers.js";
import TextDisplay from "../kit/TextDisplay.vue";
import Icon from "../kit/Icon.vue";
import ProgressBar from "../kit/ProgressBar.vue";
import {age} from "../format/time.js";
import {computed} from "vue";
import {planProgress, standingOf} from "../domain/plans.js";
import {bodyOf, isClosed, sectionsOf, titleOf, updatedAt} from "../domain/row.js";
import {usePlanRows} from "../composables/planRows.js";
import {rows} from "../sync/rows.js";
import {refParts} from "../domain/records.js";
import {pluralTitle} from "../domain/navigation.js";

const props = defineProps({resource: Object});
const plan = computed(() => planProgress(props.resource));
// a plan's progress is its tasks, counted as its own page counts them, with the phase it is in beside it
usePlanRows(() => (plan.value ? [props.resource] : []));
const standing = computed(() => (plan.value ? standingOf(props.resource, rows("tasks")) : null));
const parts = computed(() => (props.resource.table === "sequences" ? props.resource.steps.length : sectionsOf(props.resource.body).length));
// a collection's members counted by kind, such as 14 members: 11 reports, 3 plans
const members = computed(() => {
    const refs = props.resource.members || [];
    if (!refs.length) return "";
    const counts = refs.reduce((tally, ref) => tally.set(refParts(ref).table, (tally.get(refParts(ref).table) || 0) + 1), new Map());
    const kinds = [...counts].map(([table, n]) => `${n} ${n > 1 ? pluralTitle(meta(table).title) : meta(table).title}`.toLowerCase());
    return `${refs.length} member${refs.length > 1 ? "s" : ""}: ${kinds.join(", ")}`;
});
const partWord = computed(() => (props.resource.table === "sequences" ? "step" : "part"));
</script>

<template>
    <button type="button" :class="['card', {completed: isClosed(resource)}]">
        <span class="head">
            <Icon :name="meta(resource.table).icon" :size="14" />
            <span class="n">{{ meta(resource.table).title }} {{ resource.id }}</span>
            <span class="age">{{ age(updatedAt(resource)) }}</span>
        </span>
        <span class="title">{{ titleOf(resource) }}</span>
        <template v-if="plan">
            <span class="plan-steps">{{ standing.title }} · phase {{ plan.phase }} of {{ plan.total }} · {{ plan.status }}</span>
            <ProgressBar :value="standing.done" :max="Math.max(1, standing.rows)" :tone="plan.status === 'done' ? 'good' : ''" />
        </template>
        <template v-else>
            <TextDisplay inline class="abstract" :text="resource.abstract || bodyOf(resource).slice(0, 300)" />
        </template>
        <template v-if="members">
            <span class="parts">{{ members }}</span>
        </template>
        <template v-if="parts && !plan">
            <span class="parts">
                {{ parts }} {{ partWord }}{{ parts > 1 ? "s" : "" }}
                <template v-if="resource.table === 'sequences'">
                    ·
                    {{ startWords(resource).join("; ") }}
                </template>
            </span>
        </template>
    </button>
</template>

<style scoped>
.card {
    display: flex;
    flex-direction: column;
    gap: 6px;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    min-height: 130px;
    overflow: hidden;
    padding: 14px 16px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--raised);
    text-align: left;
    cursor: pointer;
}
.holds {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: auto;
    color: var(--text-3);
    font-size: 11.5px;
}

.holds-kind {
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.card:hover {
    border-color: var(--border-2);
    background: var(--hover);
}
.card.completed {
    opacity: 0.6;
}
.head {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--accent-text);
    font-size: 12px;
}
.n {
    color: var(--text-3);
}
.age {
    margin-left: auto;
    color: var(--text-3);
}
.title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    overflow-wrap: anywhere;
    font-weight: 500;
}
.plan-steps {
    margin-top: auto;
    font-size: 12px;
    color: var(--text-3);
}

.abstract {
    color: var(--text-3);
    font-size: 12.5px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    overflow-wrap: anywhere;
}

.abstract :deep(*) {
    display: inline;
    margin: 0;
    padding: 0;
    border: 0;
}
.parts {
    margin-top: auto;
    color: var(--text-3);
    font-size: 11.5px;
}
</style>
