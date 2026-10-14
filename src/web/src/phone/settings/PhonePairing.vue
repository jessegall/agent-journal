<script setup>
import {onMounted, ref} from "vue";
import {api} from "../../api/client.js";
import {phone} from "../../api/phone.js";
import {phoneTime} from "../../composables/phones.js";
import Cell from "../kit/Cell.vue";
import CellGroup from "../kit/CellGroup.vue";
import {toast} from "../kit/toast.js";
import FormSheet from "../kit/FormSheet.vue";
import PhoneTunnel from "./PhoneTunnel.vue";

const emit = defineEmits(["open"]);
const connection = ref(null);
const leaving = ref(false);

async function unpair() {
    try {
        await api.disconnectPhone(connection.value.n);
    } catch (error) {
        return toast(error.message);
    }
    location.reload();
}

onMounted(async () => {
    connection.value = await phone.state().catch(() => null);
});
</script>

<template>
    <CellGroup head="Phones">
        <template v-if="connection">
            <Cell :label="connection.phone" :sub="`Reaches the journal until ${phoneTime(connection.expires)}`" icon="phone" still />
            <Cell label="Unpair this phone" sub="It stops reaching the journal until you pair it again." tone="danger" :chevron="false" @pick="leaving = true" />
        </template>
    </CellGroup>
    <PhoneTunnel @open="(target) => emit('open', target)" />
    <template v-if="leaving">
        <FormSheet
            title="Unpair this phone?"
            sub="It stops reaching the journal until you pair it again."
            button="Unpair"
            keep="Keep it paired"
            danger
            @close="leaving = false"
            @submit="unpair"
        />
    </template>
</template>
