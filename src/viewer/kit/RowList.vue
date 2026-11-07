<script setup>
import {computed, ref, TransitionGroup} from "vue";
import EmptyState from "../src/kit/EmptyState.vue";
import Skeleton from "../src/kit/Skeleton.vue";

const props = defineProps({
    rows: {type: Array, required: true},
    failure: {type: String, default: ""},
    // what is empty, in the window's own terms, and under it the sentence that says what brings rows there
    empty: {type: String, required: true},
    hint: {type: String, default: ""},
    // whether a search or a filter is on: with it, and no row left, the list says nothing matches (`matches` names it in the window's words) and what to try, not that it is empty
    searching: Boolean,
    matches: {type: String, default: "Nothing matches"},
    loaded: {type: Boolean, required: true},
    // what the skeleton looks like while the first read is out: the shape of what is coming
    shape: {type: String, default: "rows"},
    // reads the next page behind the rows and says whether it found any; with none given the list has no pages
    older: {type: Function, default: null},
    // whether the server holds a page behind the rows, which is what shows the button to read it
    more: {type: Boolean, default: true},
    // how a row comes in and goes out, {enter, leave} each given the row's element and the call that ends it; with none given rows just appear
    arrival: {type: Object, default: null},
});
const motion = computed(() => (props.arrival ? {tag: "ul", css: false, onEnter: props.arrival.enter, onLeave: props.arrival.leave} : {}));
const finished = ref(false);
async function showMore(older) {
    finished.value = !(await older());
}
</script>

<template>
    <template v-if="!loaded && !failure && !rows.length">
        <Skeleton :shape="shape" />
    </template>
    <template v-else-if="failure">
        <p class="row-list-failure">{{ failure }}</p>
    </template>
    <template v-else-if="!rows.length && loaded">
        <EmptyState :title="searching ? matches : empty" data-row-list-empty :data-searching="searching ? '' : undefined">{{ searching ? "Try other words, or clear the search." : hint }}</EmptyState>
    </template>
    <template v-else>
        <component :is="arrival ? TransitionGroup : 'ul'" v-bind="motion" class="row-list">
            <template v-for="row in rows" :key="row.id">
                <li class="row-list-row" :data-row="row.id">
                    <slot :row="row" />
                </li>
            </template>
        </component>
        <template v-if="older && more && !finished && rows.length">
            <button type="button" class="row-list-more" data-row-list-more @click="showMore(older)">Show more</button>
        </template>
    </template>
</template>

<style scoped>
.row-list-more {
    margin: 6px 0 0;
    padding: 2px 8px;
    border: 0;
    border-radius: 5px;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.row-list-more:hover {
    background: var(--hover);
    color: var(--text);
}

.row-list {
    animation: row-list-in 0.25s ease both;
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.row-list-row {
    display: flex;
    gap: 10px;
    align-items: baseline;
    padding: 6px 8px;
    border-radius: 6px;
    color: var(--text);
}

.row-list-row:hover {
    background: var(--bg-2, rgba(255, 255, 255, 0.03));
}

.row-list-failure {
    margin: 0;
    color: var(--text-2);
}

@keyframes row-list-in {
    from {
        opacity: 0;
    }
}
</style>
