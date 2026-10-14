<script setup>
import {ref} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";

defineProps({cause: {type: Object, required: true}});
const emit = defineEmits(["restarted"]);
const busy = ref("");
const result = ref("");

async function run(which, call) {
    busy.value = which;
    result.value = "";
    try {
        result.value = await call();
        emit("restarted");
    } catch (e) {
        result.value = e.message;
    } finally {
        busy.value = "";
    }
}

const restart = () => run("restart", async () => (await api.restartTunnel(), "The tunnel is starting again."));
const update = () => run("update", () => api.updateTunler());
</script>

<template>
    <div class="tunnel-cause">
        <p class="tunnel-cause-text">{{ cause.text }}</p>
        <template v-if="cause.lines.length">
            <pre class="tunnel-cause-lines">{{ cause.lines.join("\n") }}</pre>
        </template>
        <div class="tunnel-cause-actions">
            <Btn small :busy="busy === 'restart'" @click="restart">Restart the tunnel</Btn>
            <Btn small :busy="busy === 'update'" @click="update">Update tunler</Btn>
        </div>
        <template v-if="result">
            <p class="tunnel-cause-result">{{ result }}</p>
        </template>
    </div>
</template>

<style scoped>
.tunnel-cause {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    border: 1px solid var(--line);
    border-radius: 10px;
}

.tunnel-cause-text,
.tunnel-cause-result {
    margin: 0;
    color: var(--text-2);
    font-size: 12.5px;
    line-height: 1.5;
}

.tunnel-cause-lines {
    margin: 0;
    max-height: 96px;
    overflow: auto;
    color: var(--text-3);
    font-family: var(--mono);
    font-size: 11.5px;
    white-space: pre-wrap;
}

.tunnel-cause-actions {
    display: flex;
    gap: 8px;
}
</style>
