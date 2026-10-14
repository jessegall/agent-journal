<script setup>
import {line} from "../domain/statusQueue.js";
import {computed, inject, onMounted, ref} from "vue";
import {phone} from "../api/phone.js";
import Button from "./kit/Button.vue";
import {AGENTS} from "./agents.js";
import {plainDoing} from "./doing.js";
import {ago} from "../format/time.js";
import {announce} from "./announce.js";
import {ended} from "./outbox.js";
import PhoneAgent from "./PhoneAgent.vue";
import PhoneSheet from "./PhoneSheet.vue";
import PhoneAgentControls from "./PhoneAgentControls.vue";
import PhoneAgentMore from "./agent/PhoneAgentMore.vue";
import WaitingList from "../kit/WaitingList.vue";
import {phoneWaiting} from "./agentWait.js";
import {useSharedNow} from "../composables/now.js";

const props = defineProps({
    state: {type: String, required: true},
    environment: {type: String, required: true},
    lastActive: {type: Number, default: 0},
    live: {type: Object, default: () => ({})},
});
const emit = defineEmits(["close", "started", "changed", "read"]);
const failed = inject("phoneFailed");
const doing = ref("");
const root = ref("");
const starting = ref("");
const told = ref("");
const running = computed(() => props.state !== "offline");
const secondNow = useSharedNow();
const waiting = computed(() => phoneWaiting({agent: props.state, running: props.live}, secondNow.value));

onMounted(async () => {
    try {
        const [bar, places] = await Promise.all([phone.bar(), phone.places()]);
        const words = plainDoing(line(bar.queue?.at(-1), 0)?.text || "");
        doing.value = words === "Working" ? "" : words;
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
    <PhoneSheet v-slot="{close}" label="Agent" tall @close="emit('close')">
        <h2 class="agent-title">The agent in {{ environment }}</h2>
        <dl class="agent-facts">
            <div class="agent-fact">
                <dt>State</dt>
                <dd>
                    <template v-if="live.paused">
                        <span class="agent-paused">Paused</span>
                    </template>
                    <template v-else>
                        <PhoneAgent :state="state" />
                    </template>
                </dd>
            </div>
            <template v-if="state === 'working' && doing">
                <div class="agent-fact">
                    <dt>Doing now</dt>
                    <dd>{{ doing }}</dd>
                </div>
            </template>
            <template v-if="lastActive">
                <div class="agent-fact">
                    <dt>Last active</dt>
                    <dd>{{ ago(lastActive) }}</dd>
                </div>
            </template>
        </dl>
        <template v-if="waiting">
            <WaitingList :waiting="waiting" :closable="false" />
        </template>
        <PhoneAgentControls
            :running="live"
            :alive="running"
            :silent="state === 'silent'"
            :environment="environment"
            @changed="emit('changed')"
        />
        <PhoneAgentMore @read="(target) => emit('read', target)" />
        <template v-if="told">
            <p class="agent-told" role="status">{{ told }}</p>
        </template>
        <template v-if="!running && root">
            <div class="agent-starts">
                <template v-for="agent in AGENTS" :key="agent.key">
                    <Button class="agent-start" fill :busy="starting === agent.key" :disabled="Boolean(starting)" @click="start(agent)">
                        Start {{ agent.label }}
                    </Button>
                </template>
            </div>
        </template>
        <Button kind="plain" fill @click="close">Close</Button>
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

.agent-paused {
    padding: 2px 10px;
    border-radius: 12px;
    background: color-mix(in oklab, var(--tone-warn) 20%, transparent);
    color: var(--text);
    font-weight: 600;
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
</style>
