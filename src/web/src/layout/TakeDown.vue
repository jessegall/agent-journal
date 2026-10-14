<script setup>
import {ref} from "vue";
import {api} from "../api/client.js";
import AlertDialog from "../kit/AlertDialog.vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";

const asking = ref(false);
const failure = ref("");

async function takeDown() {
    failure.value = "";
    try {
        await api.hostingTakeDown();
        window.location.assign("/login");
    } catch (e) {
        failure.value = e.message;
    }
}
</script>

<template>
    <button type="button" class="icon-btn" aria-label="Take this journal down" v-tip="'Take this journal down'" @click="asking = true">
        <Icon name="power" />
    </button>
    <template v-if="asking">
        <AlertDialog title="Take this journal down?">
            <p>Every login and phone ends now. The server stops the journal and makes a final backup. Your data stays on the server, and you can restore it.</p>
            <template v-if="failure">
                <p>{{ failure }}</p>
            </template>
            <template #actions>
                <Btn small @click="asking = false">Keep it running</Btn>
                <Btn kind="primary" small @click="takeDown">Take it down</Btn>
            </template>
        </AlertDialog>
    </template>
</template>
