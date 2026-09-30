<script setup>
import {computed, inject, onMounted, ref} from "vue";
import {phone} from "../api/phone.js";
import {line} from "../layout/bar.js";
import Spinner from "../kit/Spinner.vue";
import {AGENTS} from "./agents.js";
import {ago} from "./ago.js";
import {announce} from "./announce.js";
import {ended} from "./outbox.js";
import PhoneAgent from "./PhoneAgent.vue";
import PhoneSheet from "./PhoneSheet.vue";

const props = defineProps({state: {type: String, required: true}, environment: {type: String, required: true}, lastActive: {type: Number, default: 0}});
const emit = defineEmits(["close", "started"]);
const failed = inject("phoneFailed");
const doing = ref("");
const root = ref("");
const starting = ref("");
const told = ref("");
const running = computed(() => props.state !== "offline");

onMounted(async () => {
    try {
        const [bar, places] = await Promise.all([phone.bar(), phone.places()]);
        doing.value = line(bar.queue?.at(-1), 0)?.text || "";
        root.value = places.at;
    } catch (error) {
        if (ended(error)) failed(error);
    }
});

async function start(agent) {
    starting.value = agent.key;
    told.value = "";
    try {
        await phone.start(root.value, props.environment, agent.key);
        announce(`Starting ${agent.label}`);
        emit("started");
    } catch (error) {
        if (ended(error)) failed(error);
        else told.value = error.message;
    } finally {
        starting.value = "";
    }
}
</script>

<template>
    <PhoneSheet v-slot="{close}" label="The agent" @close="emit('close')">
        <h2 class="agent-title">The agent in {{ environment }}</h2>
        <dl class="agent-facts">
            <div class="agent-fact">
                <dt>State</dt>
                <dd><PhoneAgent :state="state" /></dd>
            </div>
            <div class="agent-fact">
                <dt>Doing now</dt>
                <dd>{{ doing || (running ? "Nothing at the moment" : "Nothing, it is not running") }}</dd>
            </div>
            <template v-if="lastActive">
                <div class="agent-fact">
                    <dt>Last active</dt>
                    <dd>{{ ago(lastActive) }}</dd>
                </div>
            </template>
        </dl>
        <template v-if="told">
            <p class="agent-told" role="status">{{ told }}</p>
        </template>
        <template v-if="!running && root">
            <div class="agent-starts">
                <template v-for="agent in AGENTS" :key="agent.key">
                    <button type="button" class="agent-start" :disabled="Boolean(starting)" @click="start(agent)">
                        <template v-if="starting === agent.key">
                            <Spinner />
                        </template>
                        Start {{ agent.label }}
                    </button>
                </template>
            </div>
        </template>
        <button type="button" class="agent-close" @click="close">Close</button>
    </PhoneSheet>
</template>

<style scoped>
.agent-title {
    margin: 4px 0 12px;
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
}

.agent-facts {
    margin: 0 0 12px;
    padding: 0;
    overflow: hidden;
    border-radius: 12px;
    background: var(--hover);
}

.agent-fact {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 4px 12px;
    min-height: 44px;
    padding: 10px 16px;
}

.agent-fact + .agent-fact {
    border-top: 1px solid var(--line);
}

.agent-fact dt {
    color: var(--text-2);
}

.agent-fact dd {
    margin: 0;
    text-align: right;
}

.agent-told {
    margin: 0 0 12px;
    color: var(--text-2);
}

.agent-starts {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
}

.agent-start {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 50px;
    border: 0;
    border-radius: 12px;
    background: var(--accent);
    color: #fff;
    font: inherit;
    font-weight: 600;
}

.agent-close {
    min-height: 50px;
    border: 0;
    border-radius: 12px;
    background: var(--hover);
    color: var(--text);
    font: inherit;
    font-weight: 600;
}
</style>
