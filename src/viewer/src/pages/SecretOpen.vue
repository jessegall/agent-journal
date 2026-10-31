<script setup>
import {computed, ref, watch} from "vue";
import {api} from "../api/client.js";
import {useAttempt} from "../composables/attempt.js";
import {complete, drafted, fieldsOf, programsKept, saved} from "../domain/secrets.js";
import Btn from "../kit/Btn.vue";
import EmptyState from "../kit/EmptyState.vue";
import Icon from "../kit/Icon.vue";
import {rows} from "../sync/rows.js";
import SecretFieldRow from "./SecretFieldRow.vue";
import SecretForm from "./SecretForm.vue";
import SecretLogin from "./SecretLogin.vue";

const props = defineProps({id: {type: Number, required: true}});
const emit = defineEmits(["back"]);
const {busy, failure, attempt} = useAttempt();
const one = computed(() => rows("secrets").find((row) => row.id === props.id && !row.deleted_at) || null);
const draft = ref(null);
watch(one, (row) => (draft.value = draft.value || (row && drafted(row))), {immediate: true});

async function keep() {
    const {done, got} = await attempt(() => api.change("secrets", props.id, saved(draft.value)));
    if (done && !programsKept(draft.value, got)) {
        failure.value = "The programs you allowed were not kept. Reload the page and allow them again.";
        return false;
    }
    return done;
}

async function save() {
    if (await keep()) emit("back");
}

async function logIn() {
    await attempt(() => api.act("secrets", props.id, "login"));
}

async function letLogIn() {
    await attempt(() => api.act("secrets", props.id, "allow-login"));
}

async function forget() {
    await attempt(() => api.act("secrets", props.id, "forget-login"));
}

async function askEachTime() {
    await attempt(() => api.act("secrets", props.id, "revoke-login"));
}

async function remove() {
    const {done} = await attempt(() => api.act("secrets", props.id, "delete"));
    if (done) emit("back");
}
</script>

<template>
    <div class="secrets">
        <Btn class="secrets-back" small @click="emit('back')">
            <Icon name="back" :size="12" />
            All secrets
        </Btn>
        <template v-if="one && draft">
            <h3 class="secrets-title">{{ one.title }}</h3>
            <SecretForm :draft="draft" @allowed="keep">
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
            <SecretLogin
                :login="one"
                :busy="busy"
                @log-in="logIn"
                @let-log-in="letLogIn"
                @forget="forget"
                @ask-each-time="askEachTime"
            />
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
