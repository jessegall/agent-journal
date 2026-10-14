<script setup>
import {useAnchoredAction} from "../composables/anchored.js";
import {api} from "../api/client.js";
import {PROVIDER_CHOICES} from "../domain/agents.js";
import {demo, unlessDemo} from "../platform/demo.js";
import Icon from "../kit/Icon.vue";
import MenuItem from "../kit/MenuItem.vue";
import MenuPanel from "../kit/MenuPanel.vue";

const props = defineProps({env: {type: Object, required: true}, live: Boolean});
const {anchor, error, toggle, run: acted} = useAnchoredAction();

const start = (provider) => acted(() => api.launchAgent(props.env.n, provider));
const stop = () => acted(() => api.stopAgentIn(props.env.n));
</script>

<template>
    <button
        type="button"
        :class="['env-start', {open: anchor}]"
        :disabled="demo"
        :title="unlessDemo(live ? `Stop the agent in ${env.title}` : `Start an agent in ${env.title}`)"
        @click.stop.prevent="toggle"
    >
        <Icon :name="live ? 'stop' : 'play'" :size="12" />
    </button>
    <template v-if="anchor">
        <MenuPanel :anchor="anchor" :min-width="220" :max-width="280" @click.stop @close="anchor = null">
            <template v-if="live">
                <p class="env-start-head">The agent in {{ env.title }} ends its session</p>
                <MenuItem @click="stop">Stop the agent</MenuItem>
            </template>
            <template v-else>
                <p class="env-start-head">Start an agent in {{ env.title }}</p>
                <template v-for="p in PROVIDER_CHOICES" :key="p.key">
                    <MenuItem @click="start(p.key)">{{ p.label }}</MenuItem>
                </template>
            </template>
            <template v-if="error">
                <p class="env-start-error">{{ error }}</p>
            </template>
        </MenuPanel>
    </template>
</template>

<style scoped>
.env-start {
    position: absolute;
    top: 50%;
    right: 6px;
    display: grid;
    place-items: center;
    width: 22px;
    height: 22px;
    border: 0;
    border-radius: 5px;
    background: none;
    color: var(--text-3);
    opacity: 0;
    transform: translateY(-50%);
    cursor: pointer;
    transition: opacity 0.15s;
}

.env-start:hover,
.env-start.open {
    background: var(--hover);
    color: var(--text);
    opacity: 1;
}

.env-start-head {
    margin: 2px 8px 6px;
    color: var(--text-3);
    font-size: 11.5px;
}

.env-start-error {
    margin: 6px 8px 4px;
    color: var(--danger);
    font-size: 11.5px;
    line-height: 1.4;
}
</style>
