<script setup>
import {computed, inject, nextTick, onMounted, ref} from "vue";
import {phone} from "../api/phone.js";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import PhoneChevron from "./PhoneChevron.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import PhoneQuestion from "./PhoneQuestion.vue";
import {ago} from "./ago.js";
import {atThisPlace, ended, flush, hold, perform, waitingActions} from "./outbox.js";
import PhoneComments from "./PhoneComments.vue";
import PhoneCommentSheet from "./PhoneCommentSheet.vue";
import {chipOpener} from "./peeked.js";
import {todoFacts} from "./todo.js";
import {kindTitle, kindWord} from "./kinds.js";
import PhoneMissing from "./PhoneMissing.vue";
import PhoneSkeletonPage from "./PhoneSkeletonPage.vue";
import {cached, remember} from "./cache.js";
import {useFades} from "./fades.js";
import {liveButtons} from "../domain/buttons.js";
import {useUnder} from "./under.js";
import {announce} from "./announce.js";
import {tick} from "./haptic.js";

const SIZES = [1, 1.12, 1.24];
const SIZE_NAMES = ["small", "medium", "large"];
const AGENTS = [1, 2, 3, 5];
const DEPTHS = ["a quick look", "a normal read", "a thorough review"];
const CHANGES = ["Make it smaller: ", "Change the order of the phases: ", "Add more detail to ", "Something is missing: "];
const props = defineProps({target: {type: String, required: true}, back: {type: String, default: "Chat"}, upNext: {type: Object, default: null}});
const missing = ref(false);
const finished = ref(false);
const kindName = computed(() => kindWord(props.target.split(":")[0]));
const phaseState = (i) => {
    if (!row.value || row.value.type !== "plan") return "";
    if (row.value.completed || row.value.data.status === "done") return "done";
    if (!["approved", "active", "waiting"].includes(row.value.data.status)) return "";
    const current = row.value.data.current || 1;
    if (i + 1 < current) return "done";
    return i + 1 === current ? "now" : "next";
};
const PHASE_WORDS = {done: "Done", now: "Now", next: "Next"};
const emit = defineEmits(["close", "open", "next", "reply"]);
const failed = inject("phoneFailed");
const refresh = inject("phoneRefresh", () => {});
const ROW = `row:${props.target}`;
const row = ref(cached(ROW) || null);
const size = ref(0);
const progress = ref(0);
const confirming = ref(false);
const approving = ref(false);
const told = ref("");
const edge = ref(null);
const heading = ref(null);
const backButton = ref(null);
const root = ref(null);
const under = useUnder(edge);
const titled = useUnder(heading);
const phases = computed(() => (row.value && row.value.data.phases) || []);
const goal = computed(() => (row.value && row.value.data.goal) || "");
const todo = computed(() => (row.value && row.value.type === "todo" ? todoFacts(row.value) : null));
const body = ref(null);
const fade = useFades(body);
const ready = computed(() => row.value && row.value.type === "plan" && row.value.data.status === "ready");

const buttons = computed(() => (row.value ? liveButtons(row.value) : []));
const pressing = ref("");
const chosen = ref("");

async function press(button) {
    pressing.value = button.label;
    told.value = "";
    try {
        await phone.press(`${row.value.type}:${row.value.n}`, button.label);
        chosen.value = button.label;
        announce(`You chose: ${button.label}`);
        tick();
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

const chipped = chipOpener((target) => emit("open", target));

async function load() {
    try {
        told.value = "";
        row.value = remember(ROW, await phone.row(props.target));
    } catch (error) {
        if (ended(error)) failed(error);
        else if (error.status === 404) missing.value = true;
        else told.value = error.message;
    }
}

const commenting = ref(false);
const justCommented = ref([]);
const myRef = computed(() => (row.value ? `${row.value.type}:${row.value.n}` : props.target));
const heldComments = computed(() =>
    atThisPlace(waitingActions.value)
        .filter((action) => action.kind === "comment" && action.ref === myRef.value)
        .map((action) => ({key: action.id, who: "user", text: action.text, created: 0, waiting: true})),
);
const comments = computed(() => [
    ...(row.value?.comments || []).map((made) => ({key: made.ref, who: made.who, text: made.brief || made.title, created: made.created})),
    ...justCommented.value,
    ...heldComments.value,
]);

async function commented(text) {
    const local = {key: `local-${Date.now()}`, who: "user", text, created: Date.now() / 1000, waiting: true};
    justCommented.value = [...justCommented.value, local];
    told.value = "";
    try {
        const went = await perform({kind: "comment", ref: myRef.value, text});
        justCommented.value = justCommented.value.filter((one) => one !== local);
        if (went === "held") return announce("Comment waits to send");
        announce("Comment added");
        justCommented.value = [...justCommented.value, {...local, waiting: false}];
        await load();
        justCommented.value = [];
    } catch (error) {
        justCommented.value = justCommented.value.filter((one) => one !== local);
        if (ended(error)) failed(error);
        else told.value = error.status === 422 ? `A ${kindWord(row.value.type)} takes no comments.` : `That comment didn't go through: ${error.message}`;
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
        if (went !== "held") finished.value = true;
    } catch (error) {
        if (error.status === 409) told.value = "This plan changed since you opened it. Look at it again.";
        else if (ended(error)) failed(error);
        else told.value = `That didn't go through: ${error.message}. Try again.`;
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
    fade();
    (heading.value || root.value?.querySelector(".missing-title") || backButton.value)?.focus({preventScroll: true});
});
</script>

<template>
    <section ref="root" class="reader" @click.capture="chipped">
        <header :class="['reader-bar', {under}]">
            <button ref="backButton" type="button" class="reader-back" :aria-label="`Back to ${back}`" @click="emit('close')"><PhoneChevron facing="left" :size="18" /> {{ back }}</button>
            <span :class="['reader-name', {shown: titled}]" aria-hidden="true">{{ row ? row.title : "" }}</span>
            <button type="button" class="reader-size" :aria-label="`Text size, ${SIZE_NAMES[size]}`" @click="size = (size + 1) % SIZES.length">
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
            <div ref="body" class="reader-body" data-scroller :style="{fontSize: `${SIZES[size]}rem`}" @scroll.passive="scrolled">
                <span ref="edge" class="reader-edge" />
                <template v-if="row.type === 'question'">
                    <PhoneQuestion :question="row" @done="finished = true" />
                </template>
                <template v-else>
                    <span class="reader-kind">{{ kindTitle(row.type) }} · {{ ago(row.created) }}</span>
                    <h1 ref="heading" class="reader-title" tabindex="-1">{{ row.title }}</h1>
                    <template v-if="goal">
                        <p class="reader-goal">Goal: {{ goal }}</p>
                    </template>
                    <template v-if="todo">
                        <dl class="reader-facts">
                            <template v-for="fact in todo.facts" :key="fact.label">
                                <div class="reader-fact">
                                    <dt>{{ fact.label }}</dt>
                                    <template v-if="fact.text">
                                        <dd><TextDisplay :text="fact.value" inline /></dd>
                                    </template>
                                    <template v-else>
                                        <dd>{{ fact.value }}</dd>
                                    </template>
                                </div>
                            </template>
                            <template v-if="todo.after.length">
                                <div class="reader-fact">
                                    <dt>Waits on</dt>
                                    <dd>
                                        <template v-for="ref in todo.after" :key="ref">
                                            <a class="reader-chip" href="#" :data-peek="ref">{{ ref.replace(":", " ") }}</a>
                                        </template>
                                    </dd>
                                </div>
                            </template>
                        </dl>
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
                        <details :class="['reader-phase', phaseState(i)]">
                            <summary>
                                {{ i + 1 }}. {{ phase.title }}
                                <template v-if="phaseState(i)">
                                    <span :class="['reader-phase-state', phaseState(i)]">{{ PHASE_WORDS[phaseState(i)] }}</span>
                                </template>
                            </summary>
                            <p>Done when: {{ phase.when }}</p>
                            <template v-if="phase.brief">
                                <TextDisplay :text="phase.brief" />
                            </template>
                        </details>
                    </template>
                </template>
                <PhoneComments :comments="comments" />
            </div>
            <footer class="reader-foot">
                <template v-if="finished">
                    <template v-if="upNext">
                        <Btn kind="primary" large @click="emit('next')">Next: {{ upNext.title }}</Btn>
                    </template>
                    <template v-else>
                        <Btn large @click="emit('close')">Back to {{ back }}</Btn>
                    </template>
                </template>
                <template v-if="chosen">
                    <p class="reader-chosen" role="status"><Icon name="tick" :size="18" /> You chose: {{ chosen }}</p>
                </template>
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
                    <Btn kind="plain" large @click="confirming = false">Not yet</Btn>
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
                    <Btn :kind="buttons.length ? 'ghost' : 'primary'" large @click="commenting = true">Comment</Btn>
                </template>
                <template v-if="row.type === 'plan' && !reviewing">
                    <Btn kind="plain" large @click="reviewing = true">Ask for a review</Btn>
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
        <template v-else-if="missing">
            <PhoneMissing :title="`This ${kindName} no longer exists`" words="It may have been removed on your computer." :back="back" @back="emit('close')" />
        </template>
        <template v-else-if="told">
            <PhoneMissing title="This couldn't be loaded" :words="told" :back="back" @back="emit('close')">
                <button type="button" @click="load">Try again</button>
            </PhoneMissing>
        </template>
        <template v-else>
            <PhoneSkeletonPage :kind="target.split(':')[0]" />
        </template>
        <template v-if="commenting && row">
            <PhoneCommentSheet :title="row.title" @close="commenting = false" @send="commented" />
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

.reader-facts {
    margin: 0 0 16px;
    padding: 0;
    overflow: hidden;
    border-radius: 12px;
    background: var(--raised);
    font-size: 1rem;
}

.reader-fact {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 4px 12px;
    min-height: 44px;
    padding: 11px 16px;
}

.reader-fact + .reader-fact {
    border-top: 1px solid var(--line);
}

.reader-fact dt {
    color: var(--text-2);
}

.reader-fact dd {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin: 0;
    color: var(--text);
    text-align: right;
}

.reader-chip {
    padding: 1px 8px;
    border-radius: 9px;
    background: var(--hover);
    color: var(--accent-text);
    text-decoration: none;
}

.reader-body {
    flex: 1 1 auto;
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
    border-radius: 12px;
    background: var(--raised);
}

.reader-phase summary {
    min-height: 32px;
    font-weight: 600;
}

.reader-foot {
    display: flex;
    flex: none;
    max-height: 45%;
    overflow-y: auto;
    overscroll-behavior-y: contain;
    flex-direction: column;
    gap: 12px;
    max-width: none;
    margin: 0 calc(-1 * var(--side));
    padding: 12px var(--side) calc(12px + env(safe-area-inset-bottom));
    border-top: 1px solid var(--line);
    background: var(--bg);
}

.reader-foot :deep(.btn) {
    min-height: 50px;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
}

.reader-foot :deep(.btn.primary) {
    background: var(--accent);
    color: #fff;
}

.reader-chosen {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 50px;
    margin: 0;
    padding: 0 16px;
    border-radius: 12px;
    background: color-mix(in oklab, var(--tone-good) 16%, transparent);
    color: var(--text);
    font-weight: 600;
}

.reader-chosen :deep(.ico) {
    color: var(--tone-good);
}

.reader-phase-state {
    margin-left: 8px;
    padding: 1px 8px;
    border-radius: 9px;
    background: var(--hover);
    color: var(--text-2);
    font-size: 0.706rem;
    font-weight: 600;
    vertical-align: middle;
}

.reader-phase-state.done {
    background: color-mix(in oklab, var(--tone-good) 18%, transparent);
    color: var(--text);
}

.reader-phase-state.now {
    background: var(--accent);
    color: #fff;
}

.reader-phase.now {
    box-shadow: inset 3px 0 0 var(--accent);
}

.reader-foot:empty {
    display: none;
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
