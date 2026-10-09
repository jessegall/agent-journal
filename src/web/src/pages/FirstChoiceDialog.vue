<script setup>
import {computed, ref} from "vue";
import Btn from "../kit/Btn.vue";
import Dialog from "../kit/Dialog.vue";
import PickCard from "../kit/PickCard.vue";
import {artOf, butler, introductionOf, profiles, useProfile} from "../composables/profiles.js";

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
    <Dialog title="Choose a profile" :closable="false" fits wide>
        <p class="first-choice-line">
            Each voice introduces itself below. Pick the one you want. You can change it, or write your own, any time in Settings › Agent.
        </p>
        <div class="first-choice-cards" role="radiogroup">
            <template v-for="row in shipped" :key="row.n">
                <PickCard
                    :title="row.title"
                    :picked="row.n === picked"
                    :art="artOf(row)"
                    :note="row.n === butler.n ? 'The voice you have now' : ''"
                    @click="picked = row.n"
                >
                    {{ introductionOf(row) }}
                </PickCard>
            </template>
        </div>
        <template #foot>
            <div class="first-choice-foot">
                <span class="first-choice-status">
                    {{
                        chosen
                            ? `The agent will talk as ${chosen.title} from its next message.`
                            : "Pick a voice, or keep the voice you have now."
                    }}
                </span>
                <Btn :busy="busy" @click="choose(butler)">Keep Butler</Btn>
                <Btn kind="primary" :disabled="!chosen" :busy="busy" @click="choose(chosen)">
                    {{ chosen ? `Use ${chosen.title}` : "Use the one you pick" }}
                </Btn>
            </div>
        </template>
    </Dialog>
</template>

<style scoped>
.first-choice-line {
    margin: 0 0 14px;
    color: var(--text-2);
    font-size: 13px;
}

.first-choice-cards {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 10px;
}

.first-choice-foot {
    display: flex;
    flex: 1;
    align-items: center;
    gap: 8px;
}

.first-choice-status {
    flex: 1;
    color: var(--text-3);
    font-size: 12px;
}

@media (max-width: 1120px) {
    .first-choice-cards {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

@media (max-width: 600px) {
    .first-choice-cards {
        grid-template-columns: 1fr;
    }

    .first-choice-foot {
        flex-direction: column;
        align-items: stretch;
    }

    .first-choice-foot .btn {
        width: 100%;
    }
}
</style>
