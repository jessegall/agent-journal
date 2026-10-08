<script setup>
import {computed, onMounted, ref} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import {hostedOn} from "../composables/settings.js";

const hosting = ref(null);
const asked = ref(false);
const failure = ref("");
const visible = computed(() => hostedOn.value && hosting.value && hosting.value.newer);

onMounted(async () => {
    try {
        hosting.value = await api.hosting();
    } catch (e) {}
});

async function upgrade() {
    failure.value = "";
    try {
        await api.hostingUpgrade();
        asked.value = true;
    } catch (e) {
        failure.value = e.message;
    }
}
</script>

<template>
    <template v-if="visible">
        <div class="band" role="status">
            <span class="text">
                Agent journal {{ hosting.latest }} is out. This server runs {{ hosting.installed }}.
                <template v-if="asked">
                    <span class="done">The server is upgrading. This page comes back once it is running.</span>
                </template>
                <template v-if="failure">
                    <span class="done">{{ failure }}</span>
                </template>
            </span>
            <template v-if="!asked">
                <Btn kind="primary" small @click="upgrade">Upgrade this server</Btn>
            </template>
        </div>
    </template>
</template>

<style scoped>
.band {
    flex: none;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 16px 6px 20px;
    border-bottom: 1px solid color-mix(in srgb, var(--accent) 40%, var(--border));
    background: color-mix(in srgb, var(--accent) 12%, var(--bg));
    font-size: 12.5px;
    color: var(--text-2);
}

.text {
    flex: 1;
    min-width: 0;
}

.done {
    color: var(--text-3);
}
</style>
