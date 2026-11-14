<script setup>
import {computed, ref} from "vue";
import Btn from "../src/kit/Btn.vue";
import EmptyState from "../src/kit/EmptyState.vue";
import FilterBar from "./FilterBar.vue";
import PageCard from "./PageCard.vue";
import PageHeader from "./PageHeader.vue";
import {applyFilter, defaultFilter} from "./toggleFilter.js";
import {vContext} from "./vContext.js";

// a page of cards: its header, the filter bar, then the cards in a grid that fills the width, none narrower than 300 px.
// Each item is drawn as a PageCard from its own fields; a page puts the card's corner, foot and actions in the slots, and groups under headings.
const props = defineProps({
    title: {type: String, required: true},
    items: {type: Array, required: true},
    fields: {type: Array, default: () => []},
    emptyTitle: {type: String, default: "Nothing here yet"},
    place: {type: Function, default: null},
});
const value = ref(defaultFilter(props.fields));
const words = ref("");
const shown = computed(() => applyFilter(props.items, props.fields, value.value, words.value, ["title", "line"]));
const groups = computed(() => [...new Set(shown.value.map((item) => item.group || ""))]);
const inGroup = (group) => shown.value.filter((item) => (item.group || "") === group);
const clear = () => {
    value.value = defaultFilter(props.fields);
    words.value = "";
};
</script>

<template>
    <div class="card-page" data-card-page>
        <PageHeader :title="title" :count="items.length">
            <template #primary><slot name="primary" /></template>
            <template #actions><slot name="actions" /></template>
        </PageHeader>
        <FilterBar v-model="value" v-model:words="words" :fields="fields" :rows="items" :shown="shown.length" />
        <div class="card-page-body">
            <template v-if="!shown.length">
                <EmptyState :title="items.length ? 'No match' : emptyTitle">
                    <template v-if="items.length">
                      <Btn small @click="clear">Clear</Btn>
                    </template>
                    <slot v-else name="empty" />
                </EmptyState>
            </template>
            <template v-for="group in groups" :key="group">
                <template v-if="group">
                  <p class="card-page-group">{{ group }}</p>
                </template>
                <div class="card-page-grid">
                    <template v-for="item in inGroup(group)" :key="item.id">
                        <PageCard v-context="place ? () => place(item) : null" :title="item.title" :icon="item.icon" :state="item.state" :line="item.line" :fault="item.fault" :data-row="item.id">
                            <template v-if="$slots.corner" #corner><slot name="corner" :item="item" /></template>
                            <template v-if="$slots.foot" #foot><slot name="foot" :item="item" /></template>
                            <template v-if="$slots['card-actions']" #actions><slot name="card-actions" :item="item" /></template>
                            <slot name="card" :item="item" />
                        </PageCard>
                    </template>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
.card-page {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
}

.card-page-body {
    position: relative;
    flex: 1;
    min-height: 120px;
    overflow-y: auto;
    padding: var(--s3) var(--inset) var(--s6);
}

.card-page-group {
    margin: var(--s3) 0 var(--s2);
    color: var(--text-4);
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
}

.card-page-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--s3);
    align-items: stretch;
}
</style>
