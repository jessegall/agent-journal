<script setup>
import {onMounted, ref} from "vue";
import {api} from "../api/client.js";
import {ago} from "../format/time.js";
import Btn from "../kit/Btn.vue";
import ListBox from "../kit/ListBox.vue";
import TeamFailure from "./TeamFailure.vue";
import "./team.css";

const devices = ref([]);
const asking = ref(0);
const busy = ref(false);
const failure = ref("");
const synced = (device) => (device.pulled_at ? `Synced ${ago(device.pulled_at)}` : "Not synced yet");

async function take(call) {
    busy.value = true;
    failure.value = "";
    try {
        devices.value = (await call()).devices;
        asking.value = 0;
    } catch (e) {
        failure.value = e.message;
    } finally {
        busy.value = false;
    }
}

onMounted(() => take(() => api.teamDevices()));
</script>

<template>
    <ListBox title="Devices" :count="devices.length" :lead="devices.length ? '' : 'No devices yet'">
        <template v-for="device in devices" :key="device.id">
            <div class="team-device">
                <span class="team-device-number">{{ device.id }}</span>
                <div class="team-device-name">
                    <span>{{ device.name }}</span>
                    <span class="team-fine">{{ device.person }} · {{ synced(device) }}</span>
                </div>
                <template v-if="device.this">
                    <span class="team-fine">This device</span>
                </template>
                <template v-else-if="asking !== device.id">
                    <Btn small kind="danger" @click="asking = device.id">Revoke</Btn>
                </template>
                <template v-if="asking === device.id">
                    <div class="team-confirm">
                        <p class="team-plain">Revoke {{ device.name }}? It stops syncing at once, and {{ device.person }} joins again with a new invitation.</p>
                        <div class="team-confirm-buttons">
                            <Btn small @click="asking = 0">Keep it</Btn>
                            <Btn small kind="danger" :busy="busy" @click="take(() => api.revokeDevice(device.id))">Revoke</Btn>
                        </div>
                    </div>
                </template>
            </div>
        </template>
        <template v-if="failure">
            <TeamFailure :text="failure" />
        </template>
    </ListBox>
</template>

<style scoped>
.team-device {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 12px;
    padding: 10px 16px;
}

.team-device + .team-device {
    border-top: 1px solid var(--border);
}

.team-device-number {
    width: 18px;
    color: var(--text-4);
    font-family: var(--mono);
    font-size: 11.5px;
}

.team-device-name {
    display: flex;
    flex: 1 1 220px;
    flex-direction: column;
    font-weight: 500;
}

.team-device-name .team-fine {
    font-weight: 400;
}

.team-confirm {
    display: flex;
    flex-basis: 100%;
    flex-direction: column;
    gap: 8px;
    padding-left: 30px;
}

.team-confirm-buttons {
    display: flex;
    gap: 8px;
}
</style>
