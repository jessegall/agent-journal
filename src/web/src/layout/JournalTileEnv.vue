<script setup>
import {computed} from "vue";
import Btn from "../kit/Btn.vue";
import Chip from "../kit/Chip.vue";
import IconCount from "../kit/IconCount.vue";
import Meter from "../kit/Meter.vue";
import StatusLabel from "../kit/StatusLabel.vue";
import Switch from "../kit/Switch.vue";
import AgentStopButton from "../chat/AgentStopButton.vue";
import {planButton} from "./statusline.js";
import {STATE_WORDS, agentLine, countsOf, envState, focusOf, planMeter} from "../sync/hub.js";

const props = defineProps({env: {type: Object, required: true}, server: {type: Object, required: true}});
const emit = defineEmits(["auto", "step", "changed"]);
const running = computed(() => envState(props.env) !== "stopped");
const wordFor = (p) => (planButton({data: p}) || [])[1];
</script>

<template>
    <div :class="['jt-env', envState(env)]">
        <div class="jt-env-line">
            <StatusLabel :class="['jt-env-state', {silent: env.silent}]" :state="envState(env)">
                {{ STATE_WORDS[envState(env)] }}
            </StatusLabel>
            <a class="jt-env-name" :href="server.page(env.name)">{{ env.name }}</a>
            <span class="jt-env-work">{{ focusOf(env).known ? focusOf(env).title : "" }}</span>
            <span class="jt-env-counts">
                <template v-for="c in countsOf(env.counts)" :key="c.key">
                    <IconCount :icon="c.icon" :count="c.n" :title="c.text" :hot="c.hot" :href="server.page(env.name, c.page)" />
                </template>
            </span>
            <span class="jt-env-agent">{{ agentLine(env) }}</span>
            <template v-if="env.owner">
                <Chip :title="`The journal steers this agent for ${env.owner.replace(':', ' ')}; it needs no auto mode`">
                    Steered by {{ env.owner.replace(":", " ") }}
                </Chip>
            </template>
            <template v-else>
                <Switch
                    :on="env.auto"
                    word="auto"
                    :title="
                        env.auto
                            ? 'The agent works through the to-do list without asking'
                            : 'The agent asks before picking up the next to-do'
                    "
                    @change="(on) => emit('auto', on)"
                />
            </template>
            <template v-if="running">
                <AgentStopButton
                    quiet
                    :environment="env.name"
                    :work="envState(env) === 'working' && env.work ? env.work.title : ''"
                    :stop="() => server.in(env.name).stopAgentNamed(env.name)"
                    @stopped="emit('changed')"
                />
            </template>
        </div>
        <template v-for="p in env.plans" :key="p.n">
            <Meter class="jt-env-plan" v-bind="planMeter(p)">
                <template v-if="wordFor(p)">
                    <Btn small @click="emit('step', p)">{{ wordFor(p) }}</Btn>
                </template>
            </Meter>
        </template>
    </div>
</template>

<style scoped>
.status-label.silent {
    --tone: var(--tone-warn);
}

.status-label.silent :deep(.status-word) {
    color: var(--tone-warn);
}

.jt-env {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 8px 16px;
    border-top: 1px solid var(--line);
    font-size: 12px;
}

.jt-env-line {
    display: grid;
    grid-template-columns: 100px minmax(80px, 170px) minmax(0, 1fr) auto auto auto auto;
    align-items: center;
    gap: 16px;
    min-height: 28px;
}

.jt-env.stopped .jt-env-line > :not(.switch-button) {
    opacity: 0.6;
}

.jt-env-name {
    overflow: hidden;
    color: var(--text);
    font-size: 12.5px;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.jt-env-name:hover {
    color: var(--accent-text);
}

.jt-env-work {
    overflow: hidden;
    color: var(--text-2);
    text-overflow: ellipsis;
    white-space: nowrap;
}

.jt-env-counts {
    display: inline-flex;
    gap: 12px;
    font-size: 11.5px;
}

.jt-env-agent {
    color: var(--text-3);
    font-size: 11.5px;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
}

.jt-env-plan {
    max-width: 560px;
    padding: 2px 0 4px 116px;
}

@container (max-width: 720px) {
    .jt-env-line {
        display: flex;
        flex-wrap: wrap;
        gap: 6px 12px;
    }

    .jt-env-state {
        width: 76px;
    }

    .jt-env-name {
        flex: 1;
        min-width: 0;
    }

    .jt-env-work {
        flex-basis: 100%;
        order: 1;
        white-space: normal;
    }

    .jt-env-work:empty,
    .jt-env-counts:empty,
    .jt-env-agent:empty {
        display: none;
    }

    .jt-env-counts {
        order: 2;
    }

    .jt-env-agent {
        order: 3;
        margin-left: auto;
    }

    .jt-env-plan {
        padding-left: 0;
    }
}
</style>
