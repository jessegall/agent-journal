<script setup>
import {computed, ref} from "vue";
import {Btn, RowList, useRows} from "@journal/window-kit";

const {rows, failure, loaded, load, context} = useRows("share list", []);
const active = computed(() => rows.value.filter((row) => row.state === "active"));
const target = ref("");
const offer = ref(null);
const runFailure = ref("");

async function make() {
    const result = await context.run(["share", "make", target.value.trim()]);
    runFailure.value = result.ok ? "" : result.error;
    offer.value = result.ok ? result.value : null;
    load();
}

async function revoke(row) {
    const result = await context.run(["share", "revoke", String(row.id)]);
    runFailure.value = result.ok ? "" : result.error;
    load();
}
</script>

<template>
    <div class="shares">
        <form class="shares-make" @submit.prevent="make">
            <input v-model="target" class="shares-target" placeholder="plans:2" aria-label="What to share" />
            <Btn kind="primary" type="submit">Make a link</Btn>
        </form>
        <template v-if="offer">
            <p class="shares-link">{{ offer.link }}</p>
            <p class="shares-hint">This link is shown once. Anyone who has it can read the plan until {{ offer.expires_at }}.</p>
        </template>
        <template v-if="runFailure">
            <p class="shares-failure">{{ runFailure }}</p>
        </template>
        <RowList :rows="active" :failure="failure" :loaded="loaded" empty="No link is open">
            <template #default="{row}">
                <span class="shares-name">{{ row.row_model }} {{ row.row_id }}, ends {{ row.expires_at }}</span>
                <Btn small @click="revoke(row)">Revoke</Btn>
            </template>
        </RowList>
    </div>
</template>

<style scoped>
.shares {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.shares-make {
    display: flex;
    gap: 8px;
}

.shares-target {
    flex: 1;
    min-width: 0;
}

.shares-link {
    margin: 0;
    overflow-wrap: anywhere;
}

.shares-hint,
.shares-failure {
    margin: 0;
    color: var(--text-2);
}

.shares-name {
    flex: 1;
}
</style>
