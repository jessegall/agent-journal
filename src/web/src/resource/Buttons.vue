<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import Spinner from "../kit/Spinner.vue";
import {route} from "../route.js";

const props = defineProps({resource: Object});
const running = ref(-1);
const error = ref("");
const all = computed(() => (Array.isArray(props.resource.data.buttons) ? props.resource.data.buttons : []));
const pressed = computed(() => [].concat(props.resource.data.pressed || []));
const chosen = computed(() => new Set(all.value.filter((b) => b.choice && pressed.value.includes(b.label)).map((b) => b.choice)));
const spent = (button) =>
    (!button.again && pressed.value.includes(button.label)) || Boolean(button.choice && chosen.value.has(button.choice));
const buttons = computed(() => all.value.filter((b) => !spent(b)));

async function press(button, i) {
    if (running.value >= 0 || spent(button)) return;
    running.value = i;
    error.value = "";
    try {
        if (button.say) await api.create("message", {brief: button.say, about: `${props.resource.type}:${props.resource.n}`});
        else if (button.n) await api.act(button.type, button.n, button.action, button.body || {});
        else await api.command(button.type, button.action, button.body || {});
        await api.act(props.resource.type, props.resource.n, "set", {
            key: "pressed",
            value: [...new Set([...pressed.value, button.label])],
        });
    } catch (e) {
        error.value = e.message;
    }
    running.value = -1;
}
</script>

<template>
    <template v-if="buttons.length || pressed.length">
        <template v-if="buttons.length">
            <div class="buttons">
                <template v-for="(button, i) in buttons" :key="i">
                    <Btn small :kind="i === 0 && !pressed.length ? 'primary' : 'ghost'" :disabled="running >= 0" @click="press(button, i)">
                        <template v-if="running === i">
                            <Spinner />
                        </template>
                        {{ button.label }}
                    </Btn>
                </template>
            </div>
        </template>
        <template v-if="pressed.length">
            <p class="pressed">You pressed {{ pressed.join(", ") }}.</p>
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

.pressed {
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
