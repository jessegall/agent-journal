<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {useAttempt} from "../composables/attempt.js";
import {complete, drafted, fieldsOf, saved} from "../domain/secrets.js";
import Btn from "../kit/Btn.vue";
import EmptyState from "../kit/EmptyState.vue";
import Icon from "../kit/Icon.vue";
import {rows} from "../sync/rows.js";
import SecretFieldRow from "./SecretFieldRow.vue";
import SecretForm from "./SecretForm.vue";

const props = defineProps({n: {type: Number, required: true}});
const emit = defineEmits(["back"]);
const {busy, failure, attempt} = useAttempt();
const one = computed(() => rows("secret").find((row) => row.n === props.n && !row.deleted) || null);
const draft = ref(drafted(one.value));

async function save() {
    const {done} = await attempt(() => api.updateSecret(props.n, saved(draft.value)));
    if (done) emit("back");
}

async function remove() {
    const {done} = await attempt(() => api.deleteSecret(props.n));
    if (done) emit("back");
}
</script>

<template>
    <div class="secrets">
        <Btn small @click="emit('back')"><Icon name="back" :size="12" /> All secrets</Btn>
        <template v-if="one">
            <h3 class="secrets-title">{{ one.title }}</h3>
            <SecretForm :draft="draft">
                <div class="secrets-values">
                    <b>Values</b>
                    <template v-for="field in fieldsOf(one)" :key="field.name">
                        <SecretFieldRow :row="one" :field="field" />
                    </template>
                </div>
                <div class="secrets-bar">
                    <Btn kind="primary" :busy="busy" :disabled="!complete(draft)" @click="save">Save</Btn>
                    <Btn @click="emit('back')">Cancel</Btn>
                </div>
            </SecretForm>
            <div class="secrets-delete">
                <b>Delete this secret</b>
                <p>The agent can no longer use it. The secret is kept for 30 days, then its values are removed from the file.</p>
                <Btn kind="danger" small :busy="busy" @click="remove">Delete secret</Btn>
            </div>
        </template>
        <template v-else>
            <EmptyState>This secret is gone.</EmptyState>
        </template>
        <template v-if="failure">
            <p class="secret-failure">{{ failure }}</p>
        </template>
    </div>
</template>
