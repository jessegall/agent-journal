<script setup>
import {computed, ref} from "vue";
import {Btn, WindowRoom, useWindow} from "@journal/window-kit";

// the standing yeses of the environment: each says what it covers, and a person removes one so the same request asks again
const view = useWindow();
const {rows, failure} = view.props.standing;
const standing = computed(() => rows.value ?? []);
const removeFailure = ref("");

async function remove(row) {
    const answer = await view.run(["standing-approval", "delete", String(row.id)]);
    removeFailure.value = answer.ok ? "" : answer.error;
    if (answer.ok) await view.reload("standing");
}

const covers = (row) => (row.scope === "same" ? "the same request" : "any request like it");
</script>

<template>
    <WindowRoom padding="14px 16px">
        <p class="heading">Standing yeses</p>
        <p v-if="failure" class="none">{{ failure }}</p>
        <p v-else-if="!standing.length" class="none" data-standing-empty>No standing yes is kept. Choose Accept and always on an approval to keep one.</p>
        <div v-for="row in standing" :key="row.id" class="row" data-standing-yes>
            <span>{{ row.text }}</span>
            <small>Accepts {{ covers(row) }}</small>
            <Btn small @click="remove(row)">Remove</Btn>
        </div>
        <p v-if="removeFailure" class="none" data-standing-failure>{{ removeFailure }}</p>
    </WindowRoom>
</template>

<style scoped>
.heading {
    margin: 0;
    padding: 2px 0 6px;
    color: var(--text);
    font-size: 12px;
}

.row {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 2px 8px;
    padding: 6px 0;
    color: var(--text-2);
    font-size: 11.5px;
}

.row small {
    grid-column: 1;
    color: var(--text-3);
    font-size: 10.5px;
}

.row button {
    grid-column: 2;
    grid-row: 1 / span 2;
}

.none {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}
</style>
