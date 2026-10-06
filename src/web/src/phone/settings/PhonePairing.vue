<script setup>
import {onMounted, ref} from "vue";
import {api} from "../../api/client.js";
import {phone} from "../../api/phone.js";
import {checkTunnel, tunnelStatus} from "../../composables/shares.js";
import {phoneTime} from "../../composables/phones.js";
import Cell from "../kit/Cell.vue";
import CellGroup from "../kit/CellGroup.vue";
import {toast} from "../kit/toast.js";
import PhoneAsk from "./PhoneAsk.vue";

const emit = defineEmits(["open"]);
const connection = ref(null);
const leaving = ref(false);

async function signOut() {
    try {
        await api.act("phone", connection.value.n, "disconnect");
    } catch (error) {
        return toast(error.message);
    }
    location.reload();
}

onMounted(async () => {
    checkTunnel().catch(() => null);
    connection.value = await phone.state().catch(() => null);
});
</script>

<template>
    <CellGroup head="This phone">
        <template v-if="connection">
            <Cell :label="connection.phone" :sub="`Reaches the journal until ${phoneTime(connection.expires)}`" icon="phone" still />
            <Cell label="Sign out of this journal" sub="It stops reaching the journal until you pair it again." tone="danger" :chevron="false" @pick="leaving = true" />
        </template>
    </CellGroup>
    <CellGroup head="Reaching the journal from outside" foot="Change the tunler login on your computer; signing out here would cut this phone off.">
        <template v-if="tunnelStatus && tunnelStatus.logged_in">
            <Cell label="Tunler account" :sub="`Connected as ${tunnelStatus.account} on ${tunnelStatus.host}`" still />
        </template>
        <template v-else-if="tunnelStatus">
            <Cell label="Tunler account" sub="Not connected on this computer" still />
        </template>
        <Cell label="Share links" sub="Pages you shared with other people" icon="share" @pick="emit('open', 'list:share')" />
    </CellGroup>
    <template v-if="leaving">
        <PhoneAsk
            title="Sign out of this journal?"
            sub="This phone stops reaching the journal until you pair it again."
            button="Sign out"
            keep="Keep it paired"
            danger
            @close="leaving = false"
            @done="signOut"
        />
    </template>
</template>
