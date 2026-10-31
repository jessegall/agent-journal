<script setup>
import {computed, ref} from "vue";
import {Btn, RowList, useRows} from "@journal/window-kit";

const {rows, failure, loaded, act, actionFailure, answer} = useRows("share list", []);
const active = computed(() => rows.value.filter((row) => row.state === "active"));
const target = ref("");
</script>

<template>
    <div class="shares">
        <form class="shares-make" @submit.prevent="act(['share', 'make', target.trim()])">
            <input v-model="target" class="shares-target" placeholder="plans:2" aria-label="What to share" />
            <Btn kind="primary" type="submit">Make a link</Btn>
        </form>
        <template v-if="answer">
            <p class="shares-link">{{ answer.link }}</p>
            <p class="shares-hint">This link is shown once. Anyone who has it can read the plan until {{ answer.expires_at }}.</p>
        </template>
        <template v-if="actionFailure">
            <p class="shares-failure">{{ actionFailure }}</p>
        </template>
        <RowList :rows="active" :failure="failure" :loaded="loaded" empty="No link is open">
            <template #default="{row}">
                <span class="shares-name">{{ row.row_model }} {{ row.row_id }}, ends {{ row.expires_at }}</span>
                <Btn small @click="act(['share', 'revoke', String(row.id)])">Revoke</Btn>
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
