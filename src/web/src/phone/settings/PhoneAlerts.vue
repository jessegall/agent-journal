<script setup>
import {onMounted, ref} from "vue";
import {phone} from "../../api/phone.js";
import Cell from "../kit/Cell.vue";
import CellGroup from "../kit/CellGroup.vue";
import {toast} from "../kit/toast.js";
import {pushPossible, subscribed} from "../push.js";

const key = ref("");
const alerts = ref(pushPossible ? Notification.permission : "unsupported");

const ALERTS = {
    granted: "On for this phone",
    denied: "Off. Turn them on in the phone's own Settings for this app.",
    default: "Off. Tap to turn them on.",
    unsupported: "This phone's browser cannot show them. Add the app to the Home Screen.",
};

async function turnOn() {
    if (alerts.value !== "default") return;
    try {
        alerts.value = await Notification.requestPermission();
        if (alerts.value === "granted") await subscribed();
    } catch (error) {
        toast(error.message);
    }
}

async function copyKey() {
    try {
        await navigator.clipboard.writeText(key.value);
        toast("The alerts key is copied");
    } catch {
        toast("Could not copy the alerts key");
    }
}

onMounted(async () => {
    key.value = await phone.pushKey().then((got) => got.key).catch(() => "");
});
</script>

<template>
    <CellGroup foot="The key lets this phone receive alerts from your computer.">
        <Cell label="Alerts on this phone" :sub="ALERTS[alerts]" icon="bell" :chevron="alerts === 'default'" :still="alerts !== 'default'" @pick="turnOn" />
        <template v-if="key">
            <Cell label="Alerts key" :sub="`${key.slice(0, 22)}…`" :chevron="false" @pick="copyKey" />
        </template>
    </CellGroup>
</template>
