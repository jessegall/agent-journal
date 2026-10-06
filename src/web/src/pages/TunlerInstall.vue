<script setup>
import {ref} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import FormField from "../kit/FormField.vue";
import TextInput from "../kit/TextInput.vue";

const REPOSITORY = "https://github.com/jessegall/tunler";

const emit = defineEmits(["installed"]);
const server = ref("");
const busy = ref(false);
const failure = ref("");

async function install() {
    busy.value = true;
    failure.value = "";
    try {
        emit("installed", await api.installTunler(server.value.trim()));
    } catch (e) {
        failure.value = e.message;
    } finally {
        busy.value = false;
    }
}
</script>

<template>
    <form class="tunler-install" @submit.prevent="install">
        <FormField label="Tunler server address" for="tunler-install-server" help="The address of the tunler server.">
            <TextInput id="tunler-install-server" :value="server" placeholder="tunler.example.com" @input="server = $event.target.value" />
        </FormField>
        <template v-if="failure">
            <p class="tunler-install-failure">{{ failure }}</p>
        </template>
        <Btn kind="primary" :busy="busy" @click="install">Install tunler</Btn>
        <p class="tunler-install-fine">
            No server yet?
            <a :href="REPOSITORY" target="_blank" rel="noopener">tunler on GitHub</a>
            explains how to run one.
        </p>
    </form>
</template>

<style scoped>
.tunler-install {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.tunler-install > .btn {
    align-self: flex-start;
}

.tunler-install-failure,
.tunler-install-fine {
    margin: 0;
    font-size: 12.5px;
    line-height: 1.5;
}

.tunler-install-failure {
    color: var(--danger);
}

.tunler-install-fine {
    color: var(--text-3);
}
</style>
