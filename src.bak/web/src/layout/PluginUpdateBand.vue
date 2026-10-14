<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {rows} from "../sync/rows.js";
import Btn from "../kit/Btn.vue";
import Notice from "../kit/Notice.vue";

const running = ref(0);
const failure = ref("");
const updates = computed(() => rows("plugin").filter((p) => !p.completed && !p.deleted && p.data.update && p.data.update.version));

async function update(plugin) {
    running.value = plugin.n;
    failure.value = "";
    try {
        await api.upgradePlugin(plugin.n, false);
    } catch (e) {
        failure.value = `${plugin.data.update.name} did not update: ${e.message}`;
    }
    running.value = 0;
}
</script>

<template>
    <template v-for="plugin in updates" :key="plugin.n">
        <Notice tone="need" class="plugin-update">
            The plugin {{ plugin.data.update.name }} has a newer version, {{ plugin.data.update.version }}.
            <template #actions>
                <Btn kind="primary" small :busy="running === plugin.n" @click="update(plugin)">Update</Btn>
            </template>
        </Notice>
    </template>
    <template v-if="failure">
        <Notice tone="danger" class="plugin-update">{{ failure }}</Notice>
    </template>
</template>

<style scoped>
.plugin-update {
    margin: 6px 12px;
}
</style>
