<script setup>
import {computed, ref} from "vue";
import Btn from "../kit/Btn.vue";
import Dialog from "../kit/Dialog.vue";
import PickCard from "../kit/PickCard.vue";
import {butler, profiles, sampleOf, useProfile} from "../composables/profiles.js";

const QUESTION = "Is the fix in?";
const picked = ref(0);
const busy = ref(false);
const shipped = computed(() => profiles.value.filter((row) => row.data.system));
const chosen = computed(() => shipped.value.find((row) => row.n === picked.value) || null);

async function choose(row) {
    busy.value = true;
    try {
        await useProfile(row);
    } finally {
        busy.value = false;
    }
}
</script>

<template>
    <Dialog title="How should the agent talk to you?" :closable="false" fits>
        <p class="first-choice-line">
            Here is the same answer in four voices. Pick the one you want. You can change it, or write your own, any time in Settings
            › Agent.
        </p>
        <p class="first-choice-question">
            Each answers the sample question
            <b>“{{ QUESTION }}”</b>
        </p>
        <div class="first-choice-cards" role="radiogroup">
            <template v-for="row in shipped" :key="row.n">
                <PickCard
                    :title="row.title"
                    :picked="row.n === picked"
                    :note="row.n === butler.n ? 'The voice you have now' : ''"
                    @click="picked = row.n"
                >
                    {{ sampleOf(row) }}
                </PickCard>
            </template>
        </div>
        <template #foot>
            <span class="first-choice-status">
                {{ chosen ? `The agent will talk as ${chosen.title} from its next message.` : "Pick one of the four, or keep the voice you have now." }}
            </span>
            <Btn :busy="busy" @click="choose(butler)">Keep Butler</Btn>
            <Btn kind="primary" :disabled="!chosen" :busy="busy" @click="choose(chosen)">
                {{ chosen ? `Use ${chosen.title}` : "Use the one you pick" }}
            </Btn>
        </template>
    </Dialog>
</template>

<style scoped>
.first-choice-line {
    margin: 0 0 14px;
    color: var(--text-2);
    font-size: 13px;
}

.first-choice-question {
    margin: 0 0 10px;
    color: var(--text-3);
    font-size: 12px;
}

.first-choice-question b {
    color: var(--text-2);
    font-weight: 500;
}

.first-choice-cards {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
}

.first-choice-status {
    flex: 1;
    color: var(--text-3);
    font-size: 12px;
}

@media (max-width: 600px) {
    .first-choice-cards {
        grid-template-columns: 1fr;
    }
}
</style>
