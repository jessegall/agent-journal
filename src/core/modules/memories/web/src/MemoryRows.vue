<script setup>
import {ref} from "vue";
import {Btn, ListTools, peekRef, RowList, Segmented, useListTools, useRows, useWindow} from "@journal/window-kit";

const TYPES = [
    {key: "fact", label: "Fact"},
    {key: "rule", label: "Rule"},
    {key: "reminder", label: "Reminder"},
];

const props = defineProps({environment: {type: String, default: ""}});
const scope = props.environment ? ["--environment", props.environment] : [];

// what the agents are told to remember, in one environment or in all: searched, and open or removed; a new one is written here and a row opens its panel
const context = useWindow();
const {rows, failure, loaded, more, load, older} = useRows(["memory list", ...scope].join(" "), ["memory.*"], {incremental: true});
const tools = useListTools(rows, {title: (row) => row.text, isOpen: (row) => row.state === "active"});
const making = ref(false);
const text = ref("");
const type = ref("fact");
const refusal = ref("");

async function make() {
    const answer = await context.run(["memory", "make", text.value.trim(), "--type", type.value, ...scope]);
    refusal.value = answer.ok ? "" : answer.error;
    if (!answer.ok) return;
    text.value = "";
    making.value = false;
    load();
}
</script>

<template>
    <div class="memories">
        <div class="memories-tools">
            <Btn small bordered data-memory-new @click="making = !making">New memory</Btn>
        </div>
        <template v-if="making">
            <form class="memories-form" data-memory-form @submit.prevent="make">
                <textarea v-model="text" rows="2" placeholder="What should be remembered?" aria-label="What should be remembered?" />
                <Segmented :options="TYPES" :value="type" @pick="type = $event" />
                <Btn small kind="primary" type="submit" :disabled="!text.trim()">Save it</Btn>
            </form>
        </template>
        <template v-if="refusal">
            <p class="memories-refusal" role="alert" data-memory-refusal>{{ refusal }}</p>
        </template>
        <ListTools :tools="tools" />
        <RowList :rows="tools.shown.value" :failure="failure" :loaded="loaded" :more="more" :older="older" empty="No memories yet" hint="A memory an agent or you keep with journal memory make shows here." :searching="tools.filtering.value">
            <template #default="{row}">
                <button type="button" class="memory" :data-memory="row.id" @click="peekRef(`memories:${row.id}`)">
                    <span class="memory-text">{{ row.text }}</span>
                    <span class="memory-kind">{{ row.type }} · weight {{ row.weight }}</span>
                </button>
            </template>
        </RowList>
    </div>
</template>

<style scoped>
.memories,
.memories-form {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.memories-form {
    align-items: flex-start;
}

.memories-form textarea {
    width: 100%;
}

.memories-refusal {
    margin: 0;
    color: var(--danger);
    font-size: 12.5px;
}

.memory {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
    padding: 4px 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.memory-kind {
    color: var(--text-3);
    font-size: 12px;
}
</style>
