<script setup>
import {computed} from "vue";
import Spinner from "../kit/Spinner.vue";
import {AGENTS} from "./agents.js";
import {ago} from "./ago.js";
import {kindCard} from "./kinds.js";
import PhoneAgent from "./PhoneAgent.vue";
import PhoneChevron from "./PhoneChevron.vue";

const props = defineProps({
    place: {type: Object, required: true},
    name: {type: String, required: true},
    current: {type: Boolean, default: false},
    busy: {type: String, default: ""},
});
const emit = defineEmits(["back", "open", "start"]);
const detail = computed(() => props.place.details?.[props.name] || {});
const running = computed(() => props.place.working.includes(props.name));
const state = computed(() => detail.value.agent || (running.value ? "idle" : "offline"));
const waits = computed(() => Object.entries(detail.value.waiting || {}).filter(([, count]) => count > 0));
</script>

<template>
    <div class="detail">
        <button type="button" class="detail-back" aria-label="Back to all journals" @click="emit('back')">
            <PhoneChevron facing="left" :size="16" />
            Journals
        </button>
        <h3 class="detail-title">{{ name }}</h3>
        <p class="detail-project">
            <span class="detail-dot" :style="{background: place.color}" />
            {{ place.project }}
        </p>
        <dl class="detail-facts">
            <div class="detail-fact">
                <dt>Agent</dt>
                <dd>
                    <template v-if="detail.agent">
                        <PhoneAgent :state="state" />
                    </template>
                    <template v-else>
                        {{ running ? "Running" : "Not running" }}
                    </template>
                </dd>
            </div>
            <template v-if="detail.doing">
                <div class="detail-fact">
                    <dt>Doing now</dt>
                    <dd>{{ detail.doing }}</dd>
                </div>
            </template>
            <template v-for="[kind, count] in waits" :key="kind">
                <div class="detail-fact">
                    <dt>{{ kindCard(kind) }}</dt>
                    <dd>{{ count }} waiting</dd>
                </div>
            </template>
            <template v-if="detail.inHand">
                <div class="detail-fact">
                    <dt>In hand</dt>
                    <dd>{{ detail.inHand }}</dd>
                </div>
            </template>
            <template v-if="detail.lastActive">
                <div class="detail-fact">
                    <dt>Last active</dt>
                    <dd>{{ ago(detail.lastActive) }}</dd>
                </div>
            </template>
        </dl>
        <div class="detail-actions">
            <template v-if="!running">
                <template v-for="agent in AGENTS" :key="agent.key">
                    <button type="button" class="detail-start" :disabled="Boolean(busy)" @click="emit('start', agent.key)">
                        <template v-if="busy === agent.key">
                            <Spinner />
                        </template>
                        Start with {{ agent.label }}
                    </button>
                </template>
            </template>
            <button type="button" :class="['detail-open', {quiet: !running}]" :disabled="Boolean(busy)" @click="emit('open')">
                <template v-if="busy === 'open'">
                    <Spinner />
                </template>
                {{ current ? "Back to it" : running ? "Open" : "Open without starting" }}
            </button>
        </div>
    </div>
</template>

<style scoped>
.detail {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.detail-back {
    display: flex;
    align-self: flex-start;
    align-items: center;
    gap: 2px;
    min-height: 44px;
    padding: 0 4px 0 0;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
}

.detail-title {
    margin: 0;
    font-size: 1.3rem;
    font-weight: 700;
}

.detail-project {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 10px;
    color: var(--text-2);
}

.detail-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
}

.detail-facts {
    margin: 0 0 12px;
    padding: 0;
    overflow: hidden;
    border-radius: 12px;
    background: var(--hover);
}

.detail-fact {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 4px 12px;
    min-height: 44px;
    padding: 10px 16px;
}

.detail-fact + .detail-fact {
    border-top: 1px solid var(--line);
}

.detail-fact dt {
    color: var(--text-2);
}

.detail-fact dd {
    margin: 0;
    text-align: right;
}

.detail-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.detail-start,
.detail-open {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 50px;
    border: 0;
    border-radius: 12px;
    font: inherit;
    font-weight: 600;
}

.detail-start,
.detail-open {
    background: var(--accent);
    color: #fff;
}

.detail-open.quiet {
    background: color-mix(in oklab, var(--accent) 14%, transparent);
    color: var(--accent-text);
}
</style>
