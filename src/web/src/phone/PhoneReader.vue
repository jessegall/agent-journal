<script setup>
import {computed, inject, onMounted, ref} from "vue";
import {phone} from "../api/phone.js";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import Spinner from "../kit/Spinner.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import PhoneQuestion from "./PhoneQuestion.vue";
import {ago} from "./ago.js";
import {ended} from "./outbox.js";
import {peeked} from "./peeked.js";
import {liveButtons} from "../domain/buttons.js";

const SIZES = [16, 18, 20];
const KINDS = {report: "Report", doc: "Document", plan: "Plan", todo: "To-do", work: "Work", fact: "Fact", rule: "Rule", message: "Message"};
const NAMES = {doc: "document", todo: "to-do"};
const props = defineProps({target: {type: String, required: true}, back: {type: String, default: "Chat"}});
const emit = defineEmits(["close", "open", "reply"]);
const failed = inject("phoneFailed");
const refresh = inject("phoneRefresh", () => {});
const row = ref(null);
const size = ref(0);
const progress = ref(0);
const confirming = ref(false);
const approving = ref(false);
const told = ref("");
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
    try {
        await phone.approve(row.value.n, row.value.updated);
        told.value = "Approved. The agent starts it.";
        refresh();
        await load();
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

onMounted(load);
</script>

<template>
    <section class="reader" @click.capture="chipped">
        <header class="reader-bar">
            <button type="button" class="reader-back" @click="emit('close')"><Icon name="back" :size="16" /> {{ back }}</button>
            <button type="button" class="reader-size" title="Text size" @click="size = (size + 1) % SIZES.length">Aa</button>
            <span class="reader-progress" :style="{width: `${progress * 100}%`}" />
        </header>
        <template v-if="row">
            <div class="reader-body" :style="{fontSize: `${SIZES[size]}px`}" @scroll="scrolled">
                <template v-if="row.type === 'question'">
                    <PhoneQuestion :question="row" />
                </template>
                <template v-else>
                    <span class="reader-kind">{{ KINDS[row.type] || row.type }} · {{ ago(row.created) }}</span>
                    <h1 class="reader-title">{{ row.title }}</h1>
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
                    <p class="reader-told">{{ told }}</p>
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
                </template>
                <template v-else-if="row.type !== 'question'">
                    <Btn large @click="emit('reply', row.type + ':' + row.n)">Reply about this {{ NAMES[row.type] || row.type }}</Btn>
                </template>
            </footer>
        </template>
        <template v-else-if="told">
            <p class="reader-told">{{ told }}</p>
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
    align-items: center;
    justify-content: space-between;
    min-height: 48px;
    margin: 0 calc(-1 * var(--side));
    padding: 0 var(--side);
    border-bottom: 1px solid var(--line);
}

.reader-back,
.reader-size {
    display: flex;
    align-items: center;
    gap: 6px;
    min-height: 44px;
    min-width: 44px;
    border: 0;
    background: none;
    color: var(--text-2);
    font: inherit;
}

.reader-progress {
    position: absolute;
    left: 0;
    bottom: -1px;
    height: 2px;
    background: var(--accent);
}

.reader-body {
    flex: 1;
    overflow-y: auto;
    padding: 16px 0 24px;
    line-height: 1.6;
}

.reader-kind {
    color: var(--text-3);
    font-size: 13px;
}

.reader-title {
    margin: 0 0 10px;
    font-size: 1.35em;
    line-height: 1.3;
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
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-radius: 10px;
}

.reader-phase summary {
    min-height: 32px;
    font-weight: 600;
}

.reader-foot {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 0 calc(-1 * var(--side));
    padding: 10px var(--side) calc(14px + env(safe-area-inset-bottom));
    border-top: 1px solid var(--line);
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
