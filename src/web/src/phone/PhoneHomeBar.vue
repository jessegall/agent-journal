<script setup>
import Button from "./kit/Button.vue";
import {computed} from "vue";
import {SILENT, SILENT_WORD} from "../domain/agentState.js";
import {agentCounts} from "../domain/helpers.js";
import {phoneWaiting} from "./agentWait.js";
import {counted} from "../format/number.js";
import PhoneAtWorkChip from "./PhoneAtWorkChip.vue";
import Icon from "../kit/Icon.vue";
import PhoneNotify from "./PhoneNotify.vue";
import PhonePlanStrip from "./PhonePlanStrip.vue";
import PhoneWaiting from "./PhoneWaiting.vue";

const props = defineProps({
    connection: {type: Object, required: true},
    feed: {type: Object, required: true},
    under: {type: Boolean, default: false},
    offline: {type: Boolean, default: false},
    current: {type: Boolean, default: false},
    notice: {type: String, default: ""},
    actionsHere: {type: Number, default: 0},
    go: {type: Object, required: true},
    away: {type: Boolean, default: false},
});
const emit = defineEmits(["places", "agent", "at-work", "open", "list", "plan"]);
const AGENT_WORDS = {offline: "Not running", [SILENT]: SILENT_WORD};
const jobs = computed(() => {
    const live = props.feed.running || {};
    return (props.feed.agent === "working" ? 1 : 0) + agentCounts(live.helpers || [], live.subagents || []).working;
});
const paused = computed(() => Boolean(props.feed.running?.paused));
const waiting = computed(() => phoneWaiting(props.feed));
const agentWords = computed(() => {
    if (AGENT_WORDS[props.feed.agent]) return AGENT_WORDS[props.feed.agent];
    if (paused.value) return "Paused";
    if (waiting.value) return `Waiting ${waiting.value.line}`;
    return jobs.value ? `Working on ${counted(jobs.value, "job", "jobs")}` : "Idle";
});
const agentTone = computed(() => (paused.value ? "paused" : waiting.value ? "waiting" : jobs.value ? "working" : ""));
</script>

<template>
    <div :class="['home-top', {under}]">
        <header class="home-bar chat-top">
            <Button
                kind="block"
                class="top-btn"
                :aria-label="`Switch journal or environment, now ${connection.project}, ${connection.environment}`"
                @click="emit('places')"
            >
                <span class="top-line">
                    <span class="top-dot" :style="{background: connection.color}" />
                    <span class="top-name">{{ connection.project }}</span>
                    <Icon name="chevronRight" bold facing="down" :size="12" class="top-chevron" />
                </span>
                <span :class="['top-sub', {offline}]">
                    <template v-if="offline">
                        <span class="top-offline-dot" aria-hidden="true" />
                    </template>
                    {{ connection.environment }}{{ offline ? " · Offline, waiting to reconnect" : current ? "" : " · Updating…" }}
                </span>
            </Button>
            <Button
                kind="block"
                class="top-btn"
                aria-haspopup="dialog"
                :aria-label="`Main agent, ${agentWords}. Open the agent's controls`"
                @click="emit('agent')"
            >
                <span class="top-line">
                    <span class="top-name">Main agent</span>
                    <Icon name="chevronRight" bold :size="12" class="top-chevron" />
                </span>
                <span class="top-sub">
                    <span :class="['top-live', agentTone]" aria-hidden="true" />
                    {{ agentWords }}
                </span>
            </Button>
        </header>
        <div class="top-chips">
            <PhoneAtWorkChip :live="feed.running || {}" @open="emit('at-work')" />
        </div>
        <template v-if="notice">
            <p class="home-offline" role="status">{{ notice }}</p>
        </template>
        <template v-if="actionsHere">
            <p class="home-pending" role="status">
                {{ actionsHere === 1 ? "1 of your actions waits" : `${actionsHere} of your actions wait` }} to send
            </p>
        </template>
        <PhoneNotify />
        <template v-if="feed.plan">
            <PhonePlanStrip :plan="feed.plan" :go="go" :away="away" @open="emit('plan')" />
        </template>
        <PhoneWaiting :waiting="feed.waiting" @open="(target) => emit('open', target)" @list="emit('list')" />
    </div>
</template>

<style scoped>
.home-top {
    flex: none;
    max-width: none;
    margin: 0 calc(-1 * var(--side));
    padding: 0 var(--side);
    border-bottom: 1px solid transparent;
    transition: border-color 200ms linear;
}

.home-top.under {
    border-bottom-color: var(--line);
}

.home-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 52px;
    padding: 4px 0;
}

.top-btn.block {
    flex: 1;
    min-width: 0;
    background: var(--sel);
    color: inherit;
}

.top-line {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.9375rem;
    font-weight: 600;
    white-space: nowrap;
}

.top-name {
    overflow: hidden;
    text-overflow: ellipsis;
}

.top-dot,
.top-live {
    flex: none;
    width: 7px;
    height: 7px;
    border-radius: 50%;
}

.top-live {
    background: var(--text-3);
}

.top-live.working {
    background: var(--tone-good);
}

.top-live.waiting {
    background: none;
    border: 1.5px solid var(--accent-text);
    border-right-color: transparent;
    animation: top-wait 2.4s linear infinite;
}

@keyframes top-wait {
    to {
        transform: rotate(360deg);
    }
}

@media (prefers-reduced-motion: reduce) {
    .top-live.waiting {
        animation: none;
    }
}

.top-live.paused {
    background: var(--tone-warn);
}

.top-chevron {
    flex: none;
    color: var(--text-3);
}

.top-sub {
    display: flex;
    align-items: center;
    gap: 6px;
    overflow: hidden;
    color: var(--text-3);
    font-size: 0.8125rem;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.top-sub.offline {
    color: var(--text-2);
}

.top-offline-dot {
    flex: none;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--tone-warn);
}

.top-chips {
    display: flex;
    justify-content: flex-end;
}

.top-chips:empty {
    display: none;
}

.home-pending {
    margin: 0 0 6px;
    padding: 6px 12px;
    border-radius: 14px;
    background: var(--raised);
    color: var(--text-2);
    font-size: 0.824rem;
}

.home-offline {
    max-width: none;
    margin: 0 calc(-1 * var(--side));
    padding: 8px var(--side);
    background: color-mix(in oklab, var(--tone-warn) 16%, transparent);
    color: var(--text);
    font-size: 0.824rem;
    line-height: 1.35;
}
</style>
