<script setup>
import {ref} from "vue";
import {ROLES} from "../domain/members.js";
import Btn from "../kit/Btn.vue";
import FormField from "../kit/FormField.vue";
import Segmented from "../kit/Segmented.vue";
import TextInput from "../kit/TextInput.vue";

const emit = defineEmits(["invite"]);
const name = ref("");
const role = ref("writer");

function invite() {
    emit("invite", name.value, role.value);
    name.value = "";
}
</script>

<template>
    <form class="invite" @submit.prevent="invite">
        <FormField label="Invite a person" for="invite-name" help="They get a link that works once, for seven days.">
            <TextInput id="invite-name" :value="name" placeholder="Their name" @input="name = $event.target.value" />
        </FormField>
        <Segmented :options="ROLES" :value="role" @pick="(picked) => (role = picked)" />
        <Btn kind="primary" small :disabled="!name.trim()" @click="invite">Invite</Btn>
    </form>
</template>

<style scoped>
.invite {
    display: flex;
    align-items: flex-end;
    gap: 8px;
}

.invite > :first-child {
    flex: 1;
}
</style>
