<script setup>
import {ref} from "vue";
import {PhoneError, phone} from "../api/phone.js";
import {announce} from "./announce.js";

const props = defineProps({prompt: {type: String, required: true}, helper: {type: Number, default: null}});
const emit = defineEmits(["answered"]);
const busy = ref(false);
const error = ref("");

async function answer(allow) {
    busy.value = true;
    error.value = "";
    try {
        await phone.permit(props.helper, allow);
        announce(allow ? "Allowed" : "Denied");
        emit("answered");
    } catch (caught) {
        error.value = caught instanceof PhoneError ? caught.message : "Your computer did not answer. Try again.";
    } finally {
        busy.value = false;
    }
}
</script>

<template>
    <section class="permit" aria-label="A permission waits">
        <p class="permit-asks">Asks for permission</p>
        <p class="permit-what">{{ prompt }}</p>
        <div class="permit-choices">
            <button type="button" class="permit-deny" :disabled="busy" @click="answer(false)">Deny</button>
            <button type="button" class="permit-allow" :disabled="busy" @click="answer(true)">Allow</button>
        </div>
        <template v-if="error">
            <p class="permit-failed" role="alert">{{ error }}</p>
        </template>
    </section>
</template>

<style scoped>
.permit {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 14px 16px;
    border-radius: 12px;
    background: var(--hover);
}

.permit-asks {
    margin: 0;
    color: var(--warn, var(--accent-text));
    font-size: 0.824rem;
    font-weight: 600;
}

.permit-what {
    margin: 0;
    color: var(--text);
    overflow-wrap: anywhere;
}

.permit-choices {
    display: flex;
    gap: 10px;
}

.permit-deny,
.permit-allow {
    flex: 1;
    min-height: 44px;
    border: 0;
    border-radius: 10px;
    font: inherit;
    font-weight: 600;
}

.permit-deny {
    background: var(--raised);
    color: var(--text);
}

.permit-allow {
    background: var(--accent);
    color: #fff;
}

.permit-failed {
    margin: 0;
    color: var(--danger);
    font-size: 0.824rem;
}
</style>
