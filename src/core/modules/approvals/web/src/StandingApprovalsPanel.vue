<script setup>
import {computed} from "vue";
import {Btn, WindowRoom, useRunLine, useWindow} from "@journal/window-kit";

// the standing yeses of the environment: each says what it covers, and a person removes one so the same request asks again
const view = useWindow();
const {rows, failure} = view.props.standing;
const standing = computed(() => rows.value ?? []);
const {refusal: removeFailure, run} = useRunLine(() => view.reload("standing"));

const remove = (row) => run(["standing-approval", "delete", String(row.id)]);

const covers = (row) => (row.scope === "same" ? "the same request" : "any request like it");
</script>

<template>
    <WindowRoom padding="14px 16px">
        <p class="heading">Standing yeses</p>
        <template v-if="failure">
          <p class="none">{{ failure }}</p>
        </template>
        <template v-else-if="!standing.length">
          <p class="none" data-standing-empty>No standing yes is kept. Choose Accept and always on an approval to keep one.</p>
        </template>
        <template v-for="row in standing" :key="row.id">
          <div class="row" data-standing-yes>
              <span>{{ row.text }}</span>
              <small>Accepts {{ covers(row) }}</small>
              <Btn small @click="remove(row)">Remove</Btn>
          </div>
        </template>
        <template v-if="removeFailure">
          <p class="none" data-standing-failure>{{ removeFailure }}</p>
        </template>
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
