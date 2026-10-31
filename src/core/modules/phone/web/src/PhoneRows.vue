<script setup>
import {computed, ref} from "vue";
import {Btn, RowList, useRows} from "@journal/window-kit";

const {rows, failure, loaded, load, context} = useRows("phone list", ["phone.*"]);
const paired = computed(() => rows.value.filter((row) => row.state === "paired"));
const offer = ref(null);
const runFailure = ref("");

async function pair() {
    const result = await context.run(["phone", "pair"]);
    runFailure.value = result.ok ? "" : result.error;
    offer.value = result.ok ? result.value : null;
}

async function unpair(row) {
    const result = await context.run(["phone", "unpair", String(row.id)]);
    runFailure.value = result.ok ? "" : result.error;
    load();
}
</script>

<template>
    <div class="phones">
        <div class="phones-pair">
            <Btn kind="primary" @click="pair">Pair a phone</Btn>
            <template v-if="offer">
                <p class="phones-code">Code: {{ offer.code }}</p>
                <p class="phones-hint">Open {{ offer.link }} on the phone, or type the code on its pairing page. The code works once, for ten minutes.</p>
            </template>
            <template v-if="runFailure">
                <p class="phones-failure">{{ runFailure }}</p>
            </template>
        </div>
        <RowList :rows="paired" :failure="failure" :loaded="loaded" empty="No phone is paired">
            <template #default="{row}">
                <span class="phones-name">{{ row.name }}</span>
                <Btn small @click="unpair(row)">Unpair</Btn>
            </template>
        </RowList>
    </div>
</template>

<style scoped>
.phones {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.phones-pair {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
}

.phones-code {
    margin: 0;
    font-size: 18px;
    letter-spacing: 0.08em;
}

.phones-hint,
.phones-failure {
    margin: 0;
    color: var(--text-2);
}

.phones-name {
    flex: 1;
}
</style>
