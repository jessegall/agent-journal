<script setup>
import {ref} from "vue";
import {Btn, FormField, TextInput, useWindow} from "@journal/window-kit";

// the form that connects this journal to a shared server: its address and the token an admin gave this person
const props = defineProps({address: {type: String, default: ""}});
const emit = defineEmits(["connected"]);
const context = useWindow();
const address = ref(props.address);
const token = ref("");
const refusal = ref("");
const connecting = ref(false);

async function connect() {
    connecting.value = true;
    const answer = await context.run(["library", "connect", ...(address.value.trim() ? [address.value.trim()] : []), "--token", token.value.trim()]);
    connecting.value = false;
    refusal.value = answer.ok ? "" : answer.error;
    if (!answer.ok) return;
    token.value = "";
    emit("connected");
}
</script>

<template>
    <form class="connect" data-library-connect @submit.prevent="connect">
        <p class="connect-lead">Connect this journal to your team's shared server to read and share documents, sequences and checks.</p>
        <FormField label="Address" for="library-address" help="An IP address or a web address, such as 10.0.0.5 or https://library.example.com.">
            <TextInput id="library-address" v-model="address" placeholder="library.example.com" data-library-address />
        </FormField>
        <FormField label="Token" for="library-token" help="The token an admin of the server gave you. It is stored outside the project.">
            <TextInput id="library-token" v-model="token" type="password" autocomplete="off" placeholder="jsl_..." data-library-token />
        </FormField>
        <template v-if="refusal">
            <p class="connect-failure" role="alert" data-library-refusal>{{ refusal }}</p>
        </template>
        <Btn variant="primary" :busy="connecting" :disabled="!token.trim()" data-library-submit @click="connect">Connect</Btn>
    </form>
</template>

<style scoped>
.connect {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-width: 420px;
}

.connect-lead {
    margin: 0;
    color: var(--text-2);
    font-size: 13px;
}

.connect-failure {
    margin: 0;
    color: var(--danger);
    font-size: 13px;
}
</style>
