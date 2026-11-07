<script setup>
import {computed, ref} from "vue";
import {Btn, SearchBar, Skeleton, useWindow} from "@journal/window-kit";

// the window a hit opens, by the model it names; a model with no window of its own shows its hit without a link
const WINDOW_OF = {
    task: "tasks.tasks",
    plan: "plans.plans",
    doc: "documents.documents",
    question: "questions.questions",
    template: "templates.templates",
    sequence: "sequences.sequences",
    trigger: "triggers.triggers",
    check: "checks.checks",
};
const context = useWindow();
const terms = ref("");
const picked = ref(new Set());
const answer = ref(null);
const failure = ref("");
const searching = ref(false);
// the models a search can be narrowed to: those the last answer held and those already picked
const models = computed(() => [...new Set([...(answer.value?.hits || []).map((hit) => hit.cli_name), ...picked.value])].sort());

async function find() {
    const words = terms.value.trim().split(/\s+/).filter(Boolean);
    if (!words.length) return void (answer.value = null);
    searching.value = true;
    context.state["results.terms"] = words.join(" ");
    if (picked.value.size) context.state["results.model"] = [...picked.value].join(",");
    else delete context.state["results.model"];
    await context.reload("results");
    const result = context.props.results;
    searching.value = false;
    failure.value = result.failure.value;
    answer.value = failure.value ? null : result.data.value;
}

function toggle(model) {
    const next = new Set(picked.value);
    if (next.has(model)) next.delete(model);
    else next.add(model);
    picked.value = next;
    find();
}

const windowOf = (hit) => WINDOW_OF[hit.cli_name] || "";
</script>

<template>
    <div class="search">
        <SearchBar v-model="terms" @keydown.enter.prevent="find">
            <Btn variant="primary" small data-search-go @click="find">Search</Btn>
        </SearchBar>
        <template v-if="models.length">
            <div class="search-chips">
                <template v-for="model in models" :key="model">
                    <button type="button" :class="['search-chip', {on: picked.has(model)}]" :data-model="model" @click="toggle(model)">{{ model }}</button>
                </template>
            </div>
        </template>
        <template v-if="searching">
            <Skeleton shape="rows" />
        </template>
        <template v-else-if="failure">
            <p class="search-note">{{ failure }}</p>
        </template>
        <template v-else-if="answer && !answer.hits.length">
            <p class="search-note" data-no-hits>No results match all these words: {{ terms.trim() }}</p>
        </template>
        <template v-else-if="answer">
            <ul class="search-hits">
                <template v-for="hit in answer.hits" :key="`${hit.cli_name}:${hit.id}`">
                    <li>
                        <button type="button" class="search-hit" data-hit :disabled="!windowOf(hit)" @click="context.open(windowOf(hit))">
                            <span class="search-hit-name">{{ hit.cli_name }} {{ hit.id }}</span>
                            <span class="search-hit-excerpt">{{ hit.excerpt }}</span>
                        </button>
                    </li>
                </template>
            </ul>
            <p v-if="answer.closest" class="search-note" data-closest>No result holds all these words: {{ terms.trim() }}, these hold most of them, the closest first</p>
            <p v-else class="search-note" data-total>{{ answer.total }} {{ answer.total === 1 ? "result matches" : "results match" }} all these words: {{ terms.trim() }}{{ answer.total > answer.hits.length ? `, the newest ${answer.hits.length} are shown` : "" }}</p>
        </template>
    </div>
</template>

<style scoped>
.search {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.search-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.search-chip {
    padding: 2px 10px;
    border: 0;
    border-radius: 10px;
    background: var(--raised);
    color: var(--text-2);
    font-size: 12px;
    cursor: pointer;
}

.search-chip.on {
    background: var(--accent);
    color: #fff;
}

.search-hits {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.search-hit {
    display: flex;
    gap: 12px;
    width: 100%;
    padding: 8px 10px;
    border: 0;
    border-radius: 7px;
    background: none;
    color: var(--text);
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.search-hit:hover:not(:disabled) {
    background: var(--hover);
}

.search-hit:disabled {
    cursor: default;
}

.search-hit-name {
    flex: none;
    width: 110px;
    color: var(--text-3);
}

.search-hit-excerpt {
    flex: 1;
    min-width: 0;
}

.search-note {
    margin: 0;
    color: var(--text-3);
}
</style>
