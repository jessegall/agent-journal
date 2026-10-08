<script setup>
import {cache, cached} from "./cache.js";
import {computed, inject, nextTick, onMounted, ref, watch} from "vue";
import {api} from "../api/client.js";
import {phone} from "../api/phone.js";
import Btn from "../kit/Btn.vue";
import Notice from "../kit/Notice.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import PhoneButtons from "./PhoneButtons.vue";
import PhoneQuestion from "./PhoneQuestion.vue";
import {ago} from "../format/time.js";
import {atThisPlace, ended, flush, hold, perform, waitingActions} from "./outbox.js";
import PhoneComments from "./PhoneComments.vue";
import FormSheet from "./kit/FormSheet.vue";
import ActionSheet from "./kit/ActionSheet.vue";
import CellGroup from "./kit/CellGroup.vue";
import Cell from "./kit/Cell.vue";
import PhoneActs from "./PhoneActs.vue";
import PhoneVersions from "./PhoneVersions.vue";
import {itemActions, runsOffLine} from "./acts.js";
import PhoneShareSheet from "./PhoneShareSheet.vue";
import {chipOpener} from "./peeked.js";
import {itemFacts, todoLane} from "./todo.js";
import {kindTitle, kindWord} from "./kinds.js";
import PhoneMissing from "./PhoneMissing.vue";
import {useFades} from "./fades.js";
import {liveButtons} from "../domain/buttons.js";
import {useUnder} from "./under.js";
import {announce, tell, tryAgain} from "./announce.js";
import {tick} from "./haptic.js";
import PhoneReaderApprove from "./PhoneReaderApprove.vue";
import PhoneReaderBar from "./PhoneReaderBar.vue";
import PhoneReaderFacts from "./PhoneReaderFacts.vue";
import PhoneReaderPhases from "./PhoneReaderPhases.vue";
import PhoneReaderReview from "./PhoneReaderReview.vue";
import {critiqueBrief} from "../domain/critique.js";
import {DEPTHS, SIZES} from "./readerChoices.js";
import Skeleton from "../kit/Skeleton.vue";

const props = defineProps({
    target: {type: String, required: true},
    back: {type: String, default: "Chat"},
    upNext: {type: Object, default: null},
});
const missing = ref(false);
const finished = ref(false);
const kindName = computed(() => kindWord(props.target.split(":")[0]));
const emit = defineEmits(["close", "open", "next", "reply"]);
const failed = inject("phoneFailed");
const refresh = inject("phoneRefresh", () => {});
const ROW = `row:${props.target}`;
const row = ref(cached(ROW) || null);
const size = ref(0);
const progress = ref(0);
const confirming = ref(false);
const approving = ref(false);
const notice = ref("");
const edge = ref(null);
const heading = ref(null);
const root = ref(null);
const under = useUnder(edge);
const titled = useUnder(heading);
const goal = computed(() => (row.value && row.value.data.goal) || "");
const facts = computed(() => (row.value && row.value.type !== "question" ? itemFacts(row.value) : null));
const body = ref(null);
const fade = useFades(body);
const ready = computed(() => row.value && row.value.type === "plan" && row.value.data.status === "ready");

const buttons = computed(() => (row.value ? liveButtons(row.value) : []));

async function pressed() {
    notice.value = "";
    try {
        row.value = await phone.row(props.target);
        refresh();
    } catch (error) {
        if (ended(error)) failed(error);
        else tell(notice, error.message);
    }
}

const reviewing = ref(false);
const agents = ref(2);
const depth = ref(DEPTHS[1]);
const template = ref(null);

async function review() {
    hold(critiqueBrief({agents: agents.value, size: depth.value, plan: row.value, template: template.value}), `plan:${row.value.n}`);
    reviewing.value = false;
    tell(notice, "Asked for a review. The findings come back as a report linked to this plan.");
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
        notice.value = "";
        row.value = cache(ROW, await phone.row(props.target));
    } catch (error) {
        if (ended(error)) failed(error);
        else if (error.status === 404) missing.value = true;
        else notice.value = error.message;
    }
}

const commenting = ref(false);
const sharing = ref(false);
const justCommented = ref([]);
const myRef = computed(() => (row.value ? `${row.value.type}:${row.value.n}` : props.target));
const heldComments = computed(() =>
    atThisPlace(waitingActions.value)
        .filter((action) => action.kind === "comment" && action.ref === myRef.value)
        .map((action) => ({key: action.id, who: "user", text: action.text, created: 0, waiting: true}))
);
const comments = computed(() => [
    ...(row.value?.comments || []).map((made) => ({key: made.ref, who: made.who, text: made.brief || made.title, created: made.created})),
    ...justCommented.value,
    ...heldComments.value,
]);

const COMMENT = [{key: "text", label: "Your comment", placeholder: "Write a comment", required: true, area: true}];
const FIRST = {todo: "start", held: "unblock", doing: "done", asked: "done", done: "reopen"};
const SECOND = ["block", "comment"];
const acts = ref(null);
const moreOpen = ref(false);
const actions = computed(() =>
    itemActions(row.value).map((action) => ({...action, run: () => (action.word === "comment" ? (commenting.value = true) : acts.value.begin(action))}))
);
const FIRSTS = {plan: ["start"], doc: ["plan", "share"], report: ["share"], collection: ["share"], plugin: ["upgrade"]};
const firstKeys = computed(() => (row.value?.type === "todo" ? [FIRST[todoLane(row.value)]] : FIRSTS[row.value?.type] || []));
const first = computed(() => firstKeys.value.map((key) => actions.value.find((action) => action.key === key)).find(Boolean) || null);
const second = computed(() => actions.value.filter((action) => action !== first.value && SECOND.includes(action.key)));
const linked = computed(() => (row.value?.refs || []).map((ref) => ({ref, label: `${kindTitle(ref.split(":")[0])} ${ref.split(":")[1]}`})));
const files = computed(() => Object.keys(row.value?.data.files || {}));
const todoTrace = ref(null);
watch(
    () => row.value?.type === "todo" && row.value.n,
    async (n) => (todoTrace.value = n ? await api.touched(n) : null),
    {immediate: true}
);
const trace = computed(() => todoTrace.value || row.value?.data || {});
const touched = computed(() => trace.value.changed || []);
const commits = computed(() => trace.value.commits || []);

async function changed() {
    await load();
    refresh();
}

async function commented({text}) {
    const local = {key: `local-${Date.now()}`, who: "user", text, created: Date.now() / 1000, waiting: true};
    justCommented.value = [...justCommented.value, local];
    notice.value = "";
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
        else
            tell(
                notice,
                error.status === 422
                    ? `A ${kindWord(row.value.type)} takes no comments.`
                    : `That comment didn't go through: ${error.message}`
            );
    }
}

async function approve() {
    approving.value = true;
    tick();
    try {
        const went = await perform({kind: "approve", n: row.value.n, updated: row.value.updated});
        tell(
            notice,
            went === "held"
                ? "No connection right now: the approval goes as soon as the phone reaches your computer, if the plan is unchanged."
                : "Approved. The agent starts it."
        );
        refresh();
        if (went !== "held") finished.value = true;
    } catch (error) {
        if (error.status === 409) tell(notice, "This plan changed since you opened it. Look at it again.");
        else if (ended(error)) failed(error);
        else tell(notice, tryAgain(error));
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
    (heading.value || root.value?.querySelector(".missing-title") || root.value?.querySelector(".reader-back"))?.focus({
        preventScroll: true,
    });
});
</script>

<template>
    <section ref="root" class="reader" @click.capture="chipped">
        <PhoneReaderBar
            v-model:size="size"
            :back="back"
            :title="row ? row.title : ''"
            :titled="titled"
            :under="under"
            :progress="progress"
            :shareable="Boolean(row)"
            @close="emit('close')"
            @share="sharing = true"
        />
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
                    <template v-if="row.type === 'doc'">
                        <PhoneVersions :row="row" />
                    </template>
                    <template v-if="facts">
                        <PhoneReaderFacts :facts="facts.facts" :after="facts.after" />
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
                    <PhoneReaderPhases :plan="row" />
                    <template v-if="row.type === 'plan'">
                        <CellGroup>
                            <Cell label="Timeline" sub="What happened on this plan's to-dos" icon="clock" @pick="emit('open', `timeline:${row.n}`)" />
                        </CellGroup>
                    </template>
                    <template v-if="files.length">
                        <CellGroup head="Files">
                            <template v-for="name in files" :key="name">
                                <Cell :label="name" icon="file" @pick="emit('open', `attachment:${row.type}/${row.n}/${encodeURIComponent(name)}`)" />
                            </template>
                        </CellGroup>
                    </template>
                    <template v-if="touched.length">
                        <CellGroup :head="`Files changed · ${touched.length}`">
                            <template v-for="file in touched" :key="file.path">
                                <Cell
                                    :label="file.path.split('/').pop()"
                                    :sub="[file.created ? 'New' : '', `+${file.added} −${file.removed}`, file.path.includes('/') ? file.path : ''].filter(Boolean).join(' · ')"
                                    icon="file"
                                    @pick="emit('open', `file:${file.path}`)"
                                />
                            </template>
                        </CellGroup>
                    </template>
                    <template v-if="commits.length">
                        <CellGroup :head="`Commits · ${commits.length}`">
                            <template v-for="commit in commits" :key="commit.sha">
                                <Cell :label="commit.subject" :sub="commit.sha.slice(0, 7)" icon="branch" @pick="emit('open', `commit:${commit.sha}`)" />
                            </template>
                        </CellGroup>
                    </template>
                    <template v-if="linked.length">
                        <CellGroup head="Linked items">
                            <template v-for="link in linked" :key="link.ref">
                                <Cell :label="link.label" :sub="link.ref" @pick="emit('open', link.ref)" />
                            </template>
                        </CellGroup>
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
                <template v-if="notice">
                    <Notice>{{ notice }}</Notice>
                </template>
                <PhoneButtons :row="row" large @pressed="pressed" />
                <template v-if="ready && !finished">
                    <PhoneReaderApprove
                        v-model:confirming="confirming"
                        :title="row.title"
                        :approving="approving"
                        @approve="approve"
                        @reply="(start) => emit('reply', row.type + ':' + row.n, start)"
                    />
                </template>
                <template v-else-if="first && !finished">
                    <Btn :kind="buttons.length ? 'ghost' : 'primary'" large @click="first.run()">{{ first.label }}</Btn>
                </template>
                <template v-if="actions.length">
                    <div class="reader-row">
                        <template v-for="action in second" :key="action.key">
                            <Btn kind="ghost" @click="action.run()">{{ action.label }}</Btn>
                        </template>
                        <Btn kind="ghost" aria-haspopup="dialog" @click="moreOpen = true">More</Btn>
                    </div>
                </template>
                <template v-if="row.type === 'plan' && !reviewing">
                    <Btn kind="plain" large @click="reviewing = true">Ask for a review</Btn>
                </template>
                <template v-if="row.type === 'plan' && reviewing">
                    <PhoneReaderReview v-model:agents="agents" v-model:depth="depth" v-model:template="template" @review="review" />
                </template>
            </footer>
        </template>
        <template v-else-if="missing">
            <PhoneMissing
                :title="`This ${kindName} no longer exists`"
                words="It may have been removed on your computer."
                :back="back"
                @back="emit('close')"
            />
        </template>
        <template v-else-if="notice">
            <PhoneMissing title="This couldn't be loaded" :words="notice" :back="back" @back="emit('close')">
                <button type="button" @click="load">Try again</button>
            </PhoneMissing>
        </template>
        <template v-else>
            <Skeleton shape="page" label="Loading" />
        </template>
        <template v-if="sharing && row">
            <PhoneShareSheet :target="`${row.type}:${row.n}`" :title="row.title" @close="sharing = false" />
        </template>
        <template v-if="commenting && row">
            <FormSheet title="Comment" :sub="row.title" :fields="COMMENT" button="Comment" @close="commenting = false" @submit="commented" />
        </template>
        <template v-if="moreOpen && row">
            <ActionSheet :title="row.title" :about="`${kindTitle(row.type)} ${row.n}`" :actions="actions" :foot="runsOffLine(row)" @close="moreOpen = false" />
        </template>
        <template v-if="row">
            <PhoneActs ref="acts" :row="row" @changed="changed" @gone="emit('close')" @share="sharing = true" />
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

.reader-edge {
    display: block;
    height: 1px;
    margin-bottom: -1px;
}

.reader-body {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior-y: contain;
    padding: 8px 0 24px;
    overflow-x: hidden;
    line-height: 1.5;
    overflow-wrap: anywhere;
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
    padding: 12px var(--side) calc(12px + var(--safe-bottom));
    border-top: 1px solid var(--line);
    background: var(--bg);
}

.reader-foot > :deep(*) {
    flex: none;
}

.reader-foot :deep(.btn) {
    height: auto;
    min-height: 50px;
    padding-block: 8px;
    white-space: normal;
    text-align: center;
    justify-content: center;
    overflow-wrap: anywhere;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
}

.reader-foot :deep(.btn.primary) {
    background: var(--accent);
    color: #fff;
}

.reader-foot:empty {
    display: none;
}

.reader-row {
    display: grid;
    grid-auto-columns: minmax(0, 1fr);
    grid-auto-flow: column;
    gap: 8px;
}

.reader-row :deep(.btn) {
    min-height: 44px;
}

.reader-wait {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
}
</style>
