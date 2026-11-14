<script setup>
import {computed, ref} from "vue";
import {Btn, FilterBar, ListReaderLayout, PageHeader, Skeleton, TimeAgo, applyFilter, defaultFilter, removed, useWindow} from "@journal/window-kit";
import RuleEdit from "./RuleEdit.vue";
import RuleReader from "./RuleReader.vue";
import {ruleFilters, ruleItems, ruleMenu} from "./ruleWords.js";

// the rules of the project as a list and a reader: grouped by state with the rules waiting for a user first, the time at the right edge, and the filter on the waiting and active rules to start.
// A rule waiting for a user is approved or declined; an active one is edited or removed
const LIST_WIDTH = 460;
const view = useWindow();
const {rows, failure, loaded, more, load, older, act, actionFailure} = view.props.rules;
const filter = ref(defaultFilter(ruleFilters));
const words = ref("");
const shown = computed(() => applyFilter(rows.value, ruleFilters, filter.value, words.value, ["text"]));
const items = computed(() => ruleItems(shown.value));
const chosen = ref(null);
const editing = ref(null);
const menuOf = (rule, open = null) => ruleMenu(rule, {run: async (line) => {
    const answer = await view.run(line);
    if (answer.ok) load();
    return answer;
}, remove: () => act(["rule", "remove", String(rule.id)], removed(rule.id)), ask: () => (editing.value = rule), open});
const place = (item) => ({head: `Rule ${item.id}`, items: menuOf(item.row, () => (chosen.value = item.id))});
const approve = async (rule) => {
    const answer = await view.run(["rule", "approve", String(rule.id)]);
    if (answer.ok) load();
};
</script>

<template>
    <ListReaderLayout v-model:chosen="chosen" :items="items" :list-width="LIST_WIDTH" :place="place" empty-title="No rules yet" pick-line="Choose a rule" data-rules>
        <template #top>
            <PageHeader title="Rules" :count="rows.length" />
            <FilterBar v-model="filter" v-model:words="words" :fields="ruleFilters" :rows="rows" :shown="shown.length" placeholder="Search rules" />
            <template v-if="failure || actionFailure"><p class="failure" role="alert" data-rules-failure>{{ failure || actionFailure }}</p></template>
            <template v-if="more"><p class="more" data-rules-more>Older rules are not shown <Btn small bordered data-row-list-more @click="older()">Show older rules</Btn></p></template>
            <template v-if="editing"><RuleEdit :rule="editing" @close="editing = null" /></template>
        </template>
        <template #empty>
            <template v-if="!loaded"><Skeleton shape="rows" /></template>
            <template v-else>Rules you add or approve hold for every agent.</template>
        </template>
        <template #meta="{item}">
            <TimeAgo class="age" :at="item.row.created_at" />
        </template>
        <template #reader="{item}">
            <RuleReader :rule="item.row" :items="menuOf(item.row)" @approve="approve(item.row)" />
        </template>
    </ListReaderLayout>
</template>

<style scoped>
.age {
    color: var(--text-3);
    font-size: 12px;
    white-space: nowrap;
}

.more,
.failure {
    margin: 0;
    padding: 6px var(--inset);
    color: var(--text-3);
    font-size: 12px;
}

.failure {
    color: var(--bad, var(--text-2));
}
</style>
