<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import Icon from "../kit/Icon.vue";
import {here, phaseAt, phaseProgress, share, WAITS} from "./planGo.js";

const SEGMENTS = 8;
const props = defineProps({
    plan: {type: Object, required: true},
    go: {type: Object, required: true},
    away: {type: Boolean, default: false},
});
const emit = defineEmits(["open"]);
const typing = ref(false);
const focus = (event) => (typing.value = event.type === "focusin" && /^(INPUT|TEXTAREA)$/.test(event.target.tagName));
const waits = computed(() => props.plan.status === WAITS);
const at = computed(() => here(props.plan));
const phase = computed(() => phaseAt(props.plan, at.value));
const folded = computed(() => (typing.value || props.away) && !waits.value);
const total = computed(() => props.plan.phases.length);
const segmented = computed(() => total.value > 1 && total.value <= SEGMENTS);
const next = computed(() => phaseAt(props.plan, at.value + 1));
const where = computed(() => (waits.value ? "Waiting for you" : `Phase ${at.value} of ${total.value}`));
const count = computed(() => phaseProgress(phase.value).replace(" done", ""));
const label = computed(() => `${props.plan.title}, ${where.value}. ${phaseProgress(phase.value)}. Open the phases`);

onMounted(() => {
    document.addEventListener("focusin", focus);
    document.addEventListener("focusout", focus);
});

onUnmounted(() => {
    document.removeEventListener("focusin", focus);
    document.removeEventListener("focusout", focus);
});
</script>

<template>
    <section :class="['plan-strip', {waits, folded}]" aria-label="The plan that is running">
        <button type="button" class="plan-open" :aria-label="label" @click="emit('open')">
            <span class="plan-row">
                <svg
                    class="plan-flag"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                >
                    <path d="M4 14V2.5M4 3h8l-1.6 2.7L12 8.5H4" />
                </svg>
                <span class="plan-title">{{ plan.title }}</span>
                <span :class="['plan-where', {you: waits}]">
                    {{ where }}
                    <template v-if="folded">· {{ count }}</template>
                </span>
                <Icon name="chevronRight" bold :size="12" class="plan-chevron" />
            </span>
            <template v-if="!folded">
                <span class="plan-row plan-progress">
                    <template v-if="segmented">
                        <span class="plan-segs">
                            <template v-for="(each, i) in plan.phases" :key="i">
                                <span class="plan-seg">
                                    <span
                                        :style="{
                                            width: `${i + 1 < at ? 100 : i + 1 === at && !waits ? share(each) : i + 1 === at ? 100 : 0}%`,
                                        }"
                                    />
                                </span>
                            </template>
                        </span>
                    </template>
                    <template v-else-if="total > 1">
                        <span class="plan-segs">
                            <span class="plan-seg"><span :style="{width: `${((at - 1 + share(phase) / 100) / total) * 100}%`}" /></span>
                        </span>
                    </template>
                    <span class="plan-count">
                        {{ count }}
                        <template v-if="phase.todos.length">done</template>
                    </span>
                </span>
            </template>
        </button>
        <template v-if="waits && !folded">
            <div class="plan-wait">
                <template v-if="go.sent">
                    <span class="plan-note">Sent</span>
                </template>
                <template v-else-if="go.sendingNow">
                    <span class="plan-note">Continuing…</span>
                </template>
                <template v-else-if="go.waits">
                    <span class="plan-note">Continuing when you're back online</span>
                </template>
                <template v-else-if="go.stale">
                    <span class="plan-note">The plan changed since you opened it</span>
                    <button type="button" class="plan-go plan-ghost" @click="go.again()">Look again</button>
                </template>
                <template v-else-if="go.held">
                    <span class="plan-note">Continuing in {{ go.left }}</span>
                    <button type="button" class="plan-go plan-ghost" @click="go.undo()">Undo</button>
                </template>
                <template v-else>
                    <span class="plan-note">
                        <template v-if="next">{{ phase.title }} is done. {{ next.title }} is next.</template>
                        <template v-else>Phase {{ at }} is done.</template>
                    </span>
                    <button type="button" class="plan-go" @click="go.start()">Continue</button>
                </template>
            </div>
            <template v-if="go.trouble">
                <p class="plan-trouble" role="alert">{{ go.trouble }}</p>
            </template>
        </template>
    </section>
</template>

<style scoped>
.plan-strip {
    display: flex;
    flex-direction: column;
    width: calc(100% + 2 * var(--side));
    max-width: none;
    margin: 0 calc(-1 * var(--side));
    padding: 0 var(--side);
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    background: var(--bg-2);
}

.plan-strip.waits {
    border-color: color-mix(in oklab, var(--tone-warn) 45%, transparent);
    background: color-mix(in oklab, var(--tone-warn) 10%, transparent);
}

.plan-open {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
    min-height: 52px;
    padding: 8px 0 9px;
    border: 0;
    background: none;
    color: var(--text);
    font: inherit;
    text-align: left;
}

.plan-strip.folded .plan-open {
    min-height: 36px;
    padding: 7px 0;
}

.plan-row {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
}

.plan-flag {
    flex: none;
    color: var(--accent-text);
}

.waits .plan-flag {
    color: var(--tone-warn);
}

.plan-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    font-size: 0.824rem;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.plan-where {
    flex: none;
    color: var(--text-3);
    font-size: 0.765rem;
    white-space: nowrap;
}

.plan-where.you {
    color: var(--tone-warn);
    font-weight: 600;
}

.plan-chevron {
    flex: none;
    color: var(--text-4);
}

.plan-progress {
    gap: 10px;
    padding-left: 24px;
}

.plan-segs {
    display: flex;
    flex: 1;
    gap: 3px;
}

.plan-seg {
    flex: 1;
    height: 4px;
    overflow: hidden;
    border-radius: 2px;
    background: var(--border-2);
}

.plan-seg span {
    display: block;
    height: 100%;
    background: var(--accent);
}

.waits .plan-seg span {
    background: var(--tone-warn);
}

.plan-count {
    flex: none;
    color: var(--text-3);
    font-size: 0.706rem;
    font-variant-numeric: tabular-nums;
}

.plan-wait {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 0 10px 24px;
}

.plan-note {
    flex: 1;
    min-width: 0;
    color: var(--text-2);
    font-size: 0.765rem;
}

.plan-go {
    flex: none;
    min-height: 44px;
    padding: 0 14px;
    border: 0;
    border-radius: 22px;
    background: var(--accent);
    color: #fff;
    font: inherit;
    font-size: 0.824rem;
    font-weight: 600;
}

.plan-ghost {
    background: var(--sel);
    color: var(--text);
}

.plan-trouble {
    margin: 0;
    padding: 0 0 10px 24px;
    color: var(--tone-warn);
    font-size: 0.765rem;
}
</style>
