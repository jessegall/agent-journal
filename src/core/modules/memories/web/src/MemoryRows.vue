<script setup>
import {ref} from "vue";
import {Btn, ListTools, peekRef, RowList, useListTools, useRows, useWindow} from "@journal/window-kit";

const props = defineProps({environment: {type: String, default: ""}});
const scope = props.environment ? ["--environment", props.environment] : [];

// what the agents are told to remember, in one environment or in all: searched, and open or removed; a new one is written here and a row opens its panel
const context = useWindow();
const {rows, failure, loaded, more, load, older} = useRows(["memory list", ...scope].join(" "), ["memory.*"], {incremental: true});
const tools = useListTools(rows, {title: (row) => row.text, isOpen: (row) => row.state === "active"});
const making = ref(false);
const text = ref("");
const refusal = ref("");

async function make() {
    const answer = await context.run(["memory", "make", text.value.trim(), ...scope]);
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
                <Btn small variant="primary" type="submit" :disabled="!text.trim()">Save memory</Btn>
            </form>
        </template>
        <template v-if="refusal">
            <p class="memories-refusal" role="alert" data-memory-refusal>{{ refusal }}</p>
        </template>
        <ListTools :tools="tools" />
        <RowList :rows="tools.shown.value" :failure="failure" :loaded="loaded" :more="more" :older="older" empty="No memories yet" hint="Memories you or the agent save appear here." :searching="tools.filtering.value">
            <template #default="{row}">
                <button type="button" class="memory" :data-memory="row.id" @click="peekRef(`memories:${row.id}`)">
                    <span class="memory-text">{{ row.text }}</span>
                    <span class="memory-type">Weight: {{ row.weight }}</span>
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

.memory-type {
    color: var(--text-3);
    font-size: 12px;
}
</style>
