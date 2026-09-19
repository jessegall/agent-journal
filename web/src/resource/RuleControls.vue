<script setup>
import {computed, ref} from "vue";
import {act} from "../api.js";
import Btn from "../kit/Btn.vue";
import Switch from "../kit/Switch.vue";
import {route} from "../route.js";

const props = defineProps({resource: Object});
const error = ref("");
const injected = computed(() => Boolean(props.resource.data.injected));

async function toggle(on) {
    error.value = "";
    try {
        await act(route.value.env, "rule", props.resource.n, on ? "inject" : "uninject");
    } catch (e) {
        error.value = e.message;
    }
}

async function pin() {
    error.value = "";
    try {
        await act(route.value.env, "rule", props.resource.n, "pin");
    } catch (e) {
        error.value = e.message;
    }
}
</script>

<template>
    <div class="rule-controls">
        <span class="rule-control-label">Inject into</span>
        <Switch :on="injected" word="instructions" framed @change="toggle" />
        <Btn small @click="pin">Pin over chat</Btn>
        <template v-if="error">
            <span class="error">{{ error }}</span>
        </template>
    </div>
</template>

<style scoped>
.rule-controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 7px;
    margin: 2px 0 10px;
}

.rule-control-label {
    margin-right: 2px;
    color: var(--text-3);
    font-size: 12px;
}

.error {
    color: var(--danger);
    font-size: 12px;
}
</style>
