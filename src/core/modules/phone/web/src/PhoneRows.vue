<script setup>
import {computed} from "vue";
import {Btn, RowList, useRows} from "@journal/window-kit";

const {rows, failure, loaded, act, actionFailure, answer} = useRows("phone list", ["phone.*"]);
const paired = computed(() => rows.value.filter((row) => row.state === "paired"));
</script>

<template>
    <div class="phones">
        <div class="phones-pair">
            <Btn kind="primary" @click="act(['phone', 'pair'])">Pair a phone</Btn>
            <template v-if="answer">
                <p class="phones-code">Code: {{ answer.code }}</p>
                <p class="phones-hint">Open {{ answer.link }} on the phone, or type the code on its pairing page. The code works once, for ten minutes.</p>
            </template>
            <template v-if="actionFailure">
                <p class="phones-failure">{{ actionFailure }}</p>
            </template>
        </div>
        <RowList :rows="paired" :failure="failure" :loaded="loaded" empty="No phone is paired">
            <template #default="{row}">
                <span class="phones-name">{{ row.name }}</span>
                <Btn small @click="act(['phone', 'unpair', String(row.id)])">Unpair</Btn>
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
