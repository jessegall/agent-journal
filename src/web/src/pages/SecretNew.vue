<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {useAttempt} from "../composables/attempt.js";
import {complete, creating, drafted, KINDS} from "../domain/secrets.js";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import PickCard from "../kit/PickCard.vue";
import SecretForm from "./SecretForm.vue";

const emit = defineEmits(["open", "back"]);
const {busy, failure, attempt} = useAttempt();
const draft = ref(drafted(null));
const chosen = computed(() => Boolean(draft.value.kind));

const pick = (kind) => (draft.value = {...drafted(null), kind: kind.key, fields: kind.fields.map((field) => ({...field, variable: ""}))});

async function create() {
    const {done, got} = await attempt(() => api.createSecret(creating(draft.value)));
    if (done) emit("open", got.n);
}
</script>

<template>
    <div class="secrets">
        <Btn small @click="emit('back')"><Icon name="back" :size="12" /> All secrets</Btn>
        <h3 class="secrets-title">New secret</h3>
        <b>What kind of secret is it?</b>
        <div class="secrets-kinds" role="radiogroup" aria-label="Kind of secret">
            <template v-for="kind in KINDS" :key="kind.key">
                <PickCard :title="kind.title" :picked="draft.kind === kind.key" @click="pick(kind)">{{ kind.line }}</PickCard>
            </template>
        </div>
        <template v-if="chosen">
            <SecretForm :draft="draft">
                <div class="secrets-bar">
                    <Btn kind="primary" :busy="busy" :disabled="!complete(draft)" @click="create">Create secret</Btn>
                    <Btn @click="emit('back')">Cancel</Btn>
                </div>
            </SecretForm>
        </template>
        <template v-if="failure">
            <p class="secret-failure">{{ failure }}</p>
        </template>
    </div>
</template>
