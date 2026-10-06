<script setup>
import Icon from "../kit/Icon.vue";
import TunnelLogin from "./TunnelLogin.vue";
import TunlerInstall from "../pages/TunlerInstall.vue";
import {checkTunnel} from "../composables/shares.js";
import Btn from "../kit/Btn.vue";
import {route} from "../route.js";

const openSettings = () => (location.hash = `#/${route.value.env}/settings?sub=tunnel`);

defineProps({status: {type: Object, required: true}});
const emit = defineEmits(["ready"]);
</script>

<template>
    <div class="tunnel-problem">
        <Icon name="warn" :size="14" />
        <template v-if="!status.installed">
            <div class="tunnel-connect">
                <p>
                    Sharing needs
                    <b>tunler</b>
                    , and it isn't installed on this machine.
                </p>
                <TunlerInstall @installed="checkTunnel" />
            </div>
        </template>
        <template v-else-if="!status.logged_in">
            <div class="tunnel-connect">
                <p>
                    <b>tunler</b>
                    isn't connected on this machine. Connect once, and every journal here uses it:
                </p>
                <TunnelLogin :host="status.host" @ready="(got) => emit('ready', got)" />
            </div>
        </template>
        <template v-else>
            <div class="tunnel-connect">
                <template v-for="problem in status.problems" :key="problem">
                    <p>{{ problem }}</p>
                </template>
                <Btn small @click="openSettings">Open the tunler settings</Btn>
            </div>
        </template>
    </div>
</template>

<style scoped>
.tunnel-problem {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    padding: 10px 12px;
    border: 1px solid color-mix(in srgb, var(--tone-warn) 45%, transparent);
    border-radius: 8px;
    background: color-mix(in srgb, var(--tone-warn) 10%, transparent);
    color: var(--tone-warn);
}

.tunnel-problem .ico {
    flex: none;
    margin-top: 2px;
}

.tunnel-connect {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 8px;
}

.tunnel-connect > p {
    margin: 0;
    color: var(--text);
    font-size: 12.5px;
    line-height: 1.5;
}
</style>
