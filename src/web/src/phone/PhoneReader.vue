<script setup>
import {computed, inject, nextTick, onMounted, ref} from "vue";
import {phone} from "../api/phone.js";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import Spinner from "../kit/Spinner.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import PhoneQuestion from "./PhoneQuestion.vue";
import {ago} from "./ago.js";
import {ended, flush, hold, perform} from "./outbox.js";
import {peeked} from "./peeked.js";
import {liveButtons} from "../domain/buttons.js";
import {useUnder} from "./under.js";
import {announce} from "./announce.js";
import {tick} from "./haptic.js";

const SIZES = [1, 1.12, 1.24];
const AGENTS = [1, 2, 3, 5];
const DEPTHS = ["a quick look", "a normal read", "a thorough review"];
const CHANGES = ["Make it smaller: ", "Change the order of the phases: ", "Add more detail to ", "Something is missing: "];
const KINDS = {report: "Report", doc: "Document", plan: "Plan", todo: "To-do", work: "Work", fact: "Fact", rule: "Rule", message: "Message"};
const NAMES = {doc: "document", todo: "to-do"};
const props = defineProps({target: {type: String, required: true}, back: {type: String, default: "Chat"}});
const emit = defineEmits(["close", "open", "next", "reply"]);
const failed = inject("phoneFailed");
const refresh = inject("phoneRefresh", () => {});
const row = ref(null);
const size = ref(0);
const progress = ref(0);
const confirming = ref(false);
const approving = ref(false);
const told = ref("");
const edge = ref(null);
const heading = ref(null);
const backButton = ref(null);
const under = useUnder(edge);
const titled = useUnder(heading);
const phases = computed(() => (row.value && row.value.data.phases) || []);
const goal = computed(() => (row.value && row.value.data.goal) || "");
const ready = computed(() => row.value && row.value.type === "plan" && row.value.data.status === "ready");

const buttons = computed(() => (row.value ? liveButtons(row.value) : []));
const pressing = ref("");

async function press(button) {
    pressing.value = button.label;
    told.value = "";
    try {
        await phone.press(`${row.value.type}:${row.value.n}`, button.label);
        row.value = await phone.row(props.target);
        refresh();
    } catch (error) {
        if (ended(error)) failed(error);
        else told.value = error.message;
    } finally {
        pressing.value = "";
    }
}

const reviewing = ref(false);
const agents = ref(2);
const depth = ref(DEPTHS[1]);

async function review() {
    const who = agents.value === 1 ? "one agent" : `${agents.value} agents`;
    hold(`Please have ${who} give plan ${row.value.n} ${depth.value}, and compile what they find into a report linked to the plan.`, `plan:${row.value.n}`);
    reviewing.value = false;
    told.value = "Asked for a review. The findings come back as a report linked to this plan.";
    announce("Review asked for");
    try {
        await flush();
        refresh();
    } catch (error) {
        if (ended(error)) failed(error);
    }
}

function chipped(event) {
    const target = peeked(event);
    if (target) emit("open", target);
}

async function load() {
    try {
        row.value = await phone.row(props.target);
    } catch (error) {
        if (ended(error)) failed(error);
        else told.value = error.message;
    }
}

async function approve() {
    approving.value = true;
    tick();
    try {
        const went = await perform({kind: "approve", n: row.value.n, updated: row.value.updated});
        told.value =
            went === "held"
                ? "No connection right now: the approval goes as soon as the phone reaches your computer, if the plan is unchanged."
                : "Approved. The agent starts it.";
        announce(went === "held" ? "Approval waits to send" : "Plan approved");
        refresh();
        emit("next");
    } catch (error) {
        if (error.status === 409) told.value = "This plan changed since you opened it. Look at it again.";
        else failed(error);
        await load();
    } finally {
        approving.value = false;
        confirming.value = false;
    }
}

function scrolled(event) {
    const el = event.target;
    progress.value = el.scrollHeight > el.clientHeight ? el.scrollTop / (el.scrollHeight - el.clientHeight) : 1;
}

onMounted(async () => {
    await load();
    await nextTick();
    (heading.value || backButton.value)?.focus({preventScroll: true});
});
</script>

<template>
    <section class="reader" @click.capture="chipped">
        <header :class="['reader-bar', {under}]">
            <button ref="backButton" type="button" class="reader-back" :aria-label="`Back to ${back}`" @click="emit('close')"><Icon name="back" :size="20" /> {{ back }}</button>
            <span :class="['reader-name', {shown: titled}]" aria-hidden="true">{{ row ? row.title : "" }}</span>
            <button type="button" class="reader-size" aria-label="Text size" @click="size = (size + 1) % SIZES.length">
                Aa
                <span class="reader-steps">
                    <template v-for="(step, i) in SIZES" :key="step">
                        <span :class="['reader-step', {on: i === size}]" />
                    </template>
                </span>
            </button>
            <span class="reader-progress" :style="{width: `${progress * 100}%`}" />
        </header>
        <template v-if="row">
            <div class="reader-body" data-scroller :style="{fontSize: `${SIZES[size]}rem`}" @scroll.passive="scrolled">
                <span ref="edge" class="reader-edge" />
                <template v-if="row.type === 'question'">
                    <PhoneQuestion :question="row" @done="emit('next')" />
                </template>
                <template v-else>
                    <span class="reader-kind">{{ KINDS[row.type] || row.type }} · {{ ago(row.created) }}</span>
                    <h1 ref="heading" class="reader-title" tabindex="-1">{{ row.title }}</h1>
                    <template v-if="goal">
                        <p class="reader-goal">Goal: {{ goal }}</p>
                    </template>
                    <template v-if="row.abstract">
                        <TextDisplay class="reader-abstract" :text="row.abstract" />
                    </template>
                    <template v-if="row.brief">
                        <TextDisplay :text="row.brief" />
                    </template>
                    <template v-if="row.outcome">
                        <TextDisplay class="reader-goal" :text="`Done: ${row.outcome}`" />
                    </template>
                    <template v-for="part in row.sections || []" :key="part.title">
                        <h2 class="reader-part">{{ part.title }}</h2>
                        <TextDisplay :text="part.body" />
                    </template>
                    <template v-for="(phase, i) in phases" :key="phase.title">
                        <details class="reader-phase">
                            <summary>{{ i + 1 }}. {{ phase.title }}</summary>
                            <p>Done when: {{ phase.when }}</p>
                            <template v-if="phase.brief">
                                <TextDisplay :text="phase.brief" />
                            </template>
                        </details>
                    </template>
                </template>
            </div>
            <footer class="reader-foot">
                <template v-if="told">
                    <p class="reader-told" role="status">{{ told }}</p>
                </template>
                <template v-for="(button, i) in buttons" :key="button.label">
                    <Btn :kind="i === 0 ? 'primary' : ''" large :busy="pressing === button.label" :disabled="Boolean(pressing)" @click="press(button)">
                        {{ button.label }}
                    </Btn>
                </template>
                <template v-if="ready && confirming">
                    <p class="reader-told">Approve "{{ row.title }}"? The agent starts working on it.</p>
                    <Btn kind="primary" large :busy="approving" @click="approve">Yes, approve the plan</Btn>
                    <Btn large @click="confirming = false">Not yet</Btn>
                </template>
                <template v-else-if="ready">
                    <Btn kind="primary" large @click="confirming = true">Approve the plan</Btn>
                    <Btn large @click="emit('reply', row.type + ':' + row.n)">Ask for changes</Btn>
                    <div class="reader-changes">
                        <template v-for="start in CHANGES" :key="start">
                            <button type="button" class="reader-change" @click="emit('reply', row.type + ':' + row.n, start)">{{ start.replace(/[: ]+$/, "") }}</button>
                        </template>
                    </div>
                </template>
                <template v-else-if="row.type !== 'question'">
                    <Btn large @click="emit('reply', row.type + ':' + row.n)">Reply about this {{ NAMES[row.type] || row.type }}</Btn>
                </template>
                <template v-if="row.type === 'plan' && !reviewing">
                    <Btn large @click="reviewing = true">Ask for a review</Btn>
                </template>
                <template v-if="row.type === 'plan' && reviewing">
                    <span class="reader-choose">How many agents</span>
                    <div class="reader-changes">
                        <template v-for="count in AGENTS" :key="count">
                            <button type="button" :class="['reader-change', {on: agents === count}]" @click="agents = count">{{ count }}</button>
                        </template>
                    </div>
                    <span class="reader-choose">How deep</span>
                    <div class="reader-changes">
                        <template v-for="one in DEPTHS" :key="one">
                            <button type="button" :class="['reader-change', {on: depth === one}]" @click="depth = one">{{ one }}</button>
                        </template>
                    </div>
                    <Btn kind="primary" large @click="review">Ask for the review</Btn>
                </template>
            </footer>
        </template>
        <template v-else-if="told">
            <p class="reader-told" role="status">{{ told }}</p>
        </template>
        <template v-else>
            <div class="reader-wait"><Spinner /></div>
        </template>
    </section>
</template>

<style scoped>
.reader {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
}

.reader-bar {
    position: relative;
    display: flex;
    flex: none;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    min-height: 44px;
    max-width: none;
    margin: 0 calc(-1 * var(--side));
    padding: 0 8px;
    border-bottom: 1px solid transparent;
    transition: border-color 200ms linear;
}

.reader-bar.under {
    border-bottom-color: var(--line);
}

.reader-back,
.reader-size {
    display: flex;
    flex: none;
    align-items: center;
    gap: 2px;
    min-height: 44px;
    min-width: 44px;
    padding: 0 6px;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    font-size: 1rem;
}

.reader-size {
    justify-content: flex-end;
}

.reader-name {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    color: var(--text);
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 200ms linear;
}

.reader-name.shown {
    opacity: 1;
}

.reader-edge {
    display: block;
    height: 1px;
    margin-bottom: -1px;
}

.reader-progress {
    position: absolute;
    left: 0;
    bottom: -1px;
    height: 2px;
    background: var(--accent);
}

.reader-changes {
    display: flex;
    flex-wrap: nowrap;
    gap: 8px;
    max-width: none;
    margin: 0 calc(-1 * var(--side));
    padding: 0 var(--side);
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
}

.reader-changes::-webkit-scrollbar {
    display: none;
}

.reader-choose {
    color: var(--text-3);
    font-size: 0.765rem;
}

.reader-change.on {
    background: var(--accent-dim);
    color: var(--text);
}

.reader-change {
    flex: none;
    min-height: 32px;
    padding: 0 14px;
    border: 0;
    border-radius: 16px;
    background: var(--hover);
    color: var(--text-2);
    font: inherit;
    white-space: nowrap;
    font-size: 0.794rem;
}

.reader-steps {
    display: inline-flex;
    gap: 3px;
    margin-left: 6px;
    vertical-align: middle;
}

.reader-step {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--text-4);
}

.reader-step.on {
    background: var(--accent);
}

.reader-body {
    flex: 0 1 auto;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior-y: contain;
    padding: 8px 0 24px;
    line-height: 1.5;
}

.reader-kind {
    display: block;
    margin-bottom: 4px;
    color: var(--text-3);
    font-size: 0.765rem;
}

.reader-title:focus {
    outline: none;
}

.reader-title {
    margin: 0 0 12px;
    font-size: 1.65em;
    font-weight: 700;
    line-height: 1.2;
}

.reader-abstract,
.reader-goal {
    color: var(--text-2);
}

.reader-goal {
    margin: 0 0 12px;
}

.reader-part {
    margin: 22px 0 6px;
    font-size: 1.1em;
}

.reader-phase {
    margin: 10px 0;
    padding: 12px 16px;
    border-radius: 10px;
    background: var(--raised);
}

.reader-phase summary {
    min-height: 32px;
    font-weight: 600;
}

.reader-foot {
    display: flex;
    flex: none;
    flex-direction: column;
    gap: 8px;
    max-width: none;
    margin: 0 calc(-1 * var(--side));
    padding: 12px var(--side) calc(12px + env(safe-area-inset-bottom));
    border-top: 1px solid var(--line);
    background: var(--bg);
}

.reader-foot :deep(.btn) {
    min-height: 50px;
    border: 0;
    border-radius: 12px;
    background: var(--hover);
    color: var(--text);
    font-size: 1rem;
    font-weight: 600;
}

.reader-foot :deep(.btn.primary) {
    background: var(--accent);
    color: #fff;
}

.reader-told {
    margin: 0;
    color: var(--text-2);
}

.reader-wait {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
}
</style>
