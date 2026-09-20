<script setup>
import {computed, ref} from "vue";
import {act, command} from "../api.js";
import Btn from "../kit/Btn.vue";
import Spinner from "../kit/Spinner.vue";
import {route} from "../route.js";

const props = defineProps({resource: Object});
const running = ref(-1);
const error = ref("");
const all = computed(() => (Array.isArray(props.resource.data.buttons) ? props.resource.data.buttons : []));
const pressed = computed(() => props.resource.data.pressed || "");
const buttons = computed(() => all.value.filter((b) => !pressed.value || b.again));

async function press(button, i) {
    if (running.value >= 0 || (pressed.value && !button.again)) return;
    running.value = i;
    error.value = "";
    try {
        if (button.n) await act(route.value.env, button.type, button.n, button.action, button.body || {});
        else await command(route.value.env, button.type, button.action, button.body || {});
        await act(route.value.env, props.resource.type, props.resource.n, "set", {key: "pressed", value: button.label});
    } catch (e) {
        error.value = e.message;
    }
    running.value = -1;
}
</script>

<template>
    <template v-if="buttons.length || pressed">
        <template v-if="buttons.length">
            <div class="buttons">
                <template v-for="(button, i) in buttons" :key="i">
                    <Btn small :kind="i === 0 && !pressed ? 'primary' : 'ghost'" :disabled="running >= 0" @click="press(button, i)">
                        <Spinner v-if="running === i" />
                        {{ button.label }}
                    </Btn>
                </template>
            </div>
        </template>
        <template v-if="pressed">
            <p class="said">You pressed {{ pressed }}.</p>
        </template>
        <template v-if="error">
            <p class="error">{{ error }}</p>
        </template>
    </template>
</template>

<style scoped>
.buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
}

.said {
    margin: 8px 0 0;
    color: var(--text-3);
    font-size: 11.5px;
}

.error {
    margin: 8px 0 0;
    color: var(--danger);
    font-size: 11.5px;
}
</style>
