<script setup>
import {computed, inject, ref, useAttrs} from "vue";
import {WINDOW_CONTEXT} from "../../kit/windowContextKey.js";
import FoldSign from "./FoldSign.vue";
import Icon from "./Icon.vue";
import AgentTip from "../../kit/AgentTip.vue";
import MarkAction from "./MarkAction.vue";
import MarkIcon from "./MarkIcon.vue";
import TextDisplay from "./TextDisplay.vue";
import {clock, elapsed, span} from "../format/time.js";
import {useSharedNow} from "../composables/now.js";
import {useMarkMotion} from "../composables/markMotion.js";
import {useMarkRecording} from "../composables/markRecording.js";

defineOptions({inheritAttrs: false});
const props = defineProps({mark: {type: Object, required: true}, open: {type: Boolean, default: undefined}});

const attrs = useAttrs();
const LISTENERS = ["onClick", "onAct"];
const passed = computed(() => Object.fromEntries(Object.entries(attrs).filter(([name]) => !LISTENERS.includes(name))));
// a mark is one line: a mark with a second line opens in place on a click and folds on the next, and a mark given `open` is opened by
// its owner; its one-click action, `act` with the words in `mark.action`, opens what it is about, as a click does on a mark with nothing to open
const expanded = ref(false);
const hasSecondLine = computed(() => Boolean(props.mark.detail || props.mark.command || props.mark.body));
const owned = computed(() => props.open !== undefined);
const opens = computed(() => owned.value || hasSecondLine.value);
const isOpen = computed(() => (owned.value ? props.open : expanded.value));
const wanted = computed(() => (owned.value ? !props.open : hasSecondLine.value && !expanded.value));
const acts = computed(() => Boolean(props.mark.action && attrs.onAct));
const live = computed(() => opens.value || acts.value || Boolean(attrs.onClick));
const root = ref(null);
const top = ref(null);
const {folded, phase} = useMarkMotion(root, () => wanted.value);
useMarkRecording(root, wanted, phase, inject(WINDOW_CONTEXT, null));

// a click on the mark's line opens or folds it, or does its action; a click inside what an opened mark shows is that part's own
function clicked(event) {
    if (event.target !== root.value && !top.value.contains(event.target)) return;
    if (owned.value) return attrs.onClick?.(event);
    if (hasSecondLine.value) return void (expanded.value = !expanded.value);
    (attrs.onAct || attrs.onClick)?.(event);
}

const act = (event) => attrs.onAct(event);
// how a mark's work ended, where it reports it: stopped by the user is grey, an ended mark whose state is a failure red, any other green
const FAILED_STATES = ["failed", "unfinished"];
const outcome = computed(() => {
    if (props.mark.stopped || props.mark.state === "stopped") return "stopped";
    if (props.mark.tone) return props.mark.tone;
    if (!props.mark.ended) return "";
    return FAILED_STATES.includes(props.mark.state) ? "danger" : "good";
});
// the colour of a mark's icon: its outcome's where it has one, else its group's, which says whose mark it is
const shade = computed(() => {
    if (props.mark.color) return props.mark.color;
    if (outcome.value === "stopped") return "var(--text-3)";
    if (props.mark.asks) return "var(--asks)";
    if (outcome.value) return `var(--tone-${outcome.value})`;
    return props.mark.group ? `var(--group-${props.mark.group})` : "";
});
// a mark's progress bar is drawn in the mark's own colour, and in the working colour on a mark with none
const barShade = computed(() => shade.value || "var(--tone-work)");
// a run's bar shows while the run is active: a process or watch card that has ended, finished, failed or was stopped has none
const running = computed(() => !props.mark.ending && !props.mark.ended && outcome.value !== "stopped");
// a running card whose reader counts no progress shows how long its run has gone, in place of a bar nobody can work out
const now = useSharedNow();
const ranFor = computed(() =>
    props.mark.began_at && running.value && !props.mark.figure && !props.mark.counting ? elapsed(now.value - props.mark.began_at) : ""
);
// how long the work a mark stands for has run: counting up while it runs, and once it ended for how long it ran
const took = computed(() => {
    const {started, ended} = props.mark;
    if (!started) return ranFor.value;
    return ended ? `ran ${span(ended - started, true)}` : span(now.value - started, true);
});
// how much a mark matters, which its shape says: a failure, a warning or a request for the user is filled, work still running is
// outlined, and an event, work that ended well or a run the user stopped is a quiet line
const ATTENTION_TONES = ["bad", "danger", "warn"];
const weight = computed(() => {
    if (ATTENTION_TONES.includes(outcome.value) || props.mark.asks) return "attention";
    if (
        running.value &&
        (props.mark.active || props.mark.figure || props.mark.counting || props.mark.began_at || (props.mark.started && !props.mark.ended))
    )
        return "process";
    return "event";
});
const FAILED_TONES = ["bad", "danger"];
const failed = computed(() => FAILED_TONES.includes(outcome.value));
// the sign at the end of a mark: a spinner while its work runs, a tick once it passed, a cross once it failed, a square once stopped
const sign = computed(() => {
    if (weight.value === "process") return "running";
    if (failed.value) return "cross";
    if (outcome.value === "stopped") return "stopped";
    return outcome.value === "good" ? "tick" : "";
});
const status = computed(() =>
    Boolean(props.mark.figure || took.value || props.mark.docked || props.mark.stopping || sign.value || props.mark.settled || props.mark.news)
);
const symbol = computed(() => (props.mark.markIcon ? {component: MarkIcon, props: {class: "ico", name: props.mark.markIcon}} : {component: Icon, props: {name: props.mark.icon || "dot"}}));
const hover = computed(() => [props.mark.title, props.mark.time ? clock(props.mark.time) : ""].filter(Boolean).join(" · "));
const tint = computed(() => ({
    ...(shade.value ? {"--mark": shade.value} : {}),
    ...(props.mark.depth ? {"--depth": props.mark.depth} : {}),
}));
</script>

<template>
    <div
        v-bind="passed"
        ref="root"
        :class="[
            'mark',
            `w-${weight}`,
            phase,
            {
                open: isOpen,
                folding: owned && wanted,
                live,
                failed,
                stopping: mark.stopping,
                struck: mark.struck,
                worked: mark.worker,
                tinted: shade,
                console: mark.command,
                nested: mark.depth > 0,
            },
        ]"
        :style="tint"
        :title="hover"
        :data-figure-mark="mark.key"
        :data-folded="folded ? '' : null"
        :data-open="owned && open ? '' : null"
        @click="clicked"
    >
        <component
            :is="live ? 'button' : 'span'"
            ref="top"
            class="top"
            :type="live ? 'button' : undefined"
            :aria-expanded="opens ? String(Boolean(isOpen)) : undefined"
        >
            <template v-if="mark.agentId">
                <AgentTip :agent-id="mark.agentId" :label="mark.label" class="agent-icon" data-mark-agent>
                    <component :is="symbol.component" v-bind="symbol.props" />
                </AgentTip>
            </template>
            <template v-else>
                <component :is="symbol.component" v-bind="symbol.props" />
            </template>
            <template v-if="mark.worker">
                <span class="worker">{{ mark.worker }}</span>
            </template>
            <span class="head">
                <TextDisplay class="title" :text="mark.label" inline />
                <template v-if="mark.name">
                    <strong>{{ mark.name }}</strong>
                </template>
                <template v-if="opens">
                    <FoldSign :open="Boolean(isOpen)" />
                </template>
            </span>
            <template v-if="status">
                <span class="status">
                    <template v-if="mark.figure">
                        <span class="figure">{{ mark.figure }}</span>
                    </template>
                    <template v-if="took">
                        <span class="ran-for">{{ took }}</span>
                    </template>
                    <template v-if="mark.stopping">
                        <span>Stopping</span>
                    </template>
                    <template v-if="mark.news">
                        <span class="news">{{ mark.news }}</span>
                    </template>
                    <template v-if="sign === 'running'">
                        <span class="spin" aria-label="Still running"></span>
                    </template>
                    <template v-else-if="sign">
                        <MarkIcon :class="['sign', sign]" :name="sign" />
                    </template>
                    <template v-if="mark.settled">
                        <span class="settled">{{ mark.settled }}</span>
                    </template>
                </span>
            </template>
        </component>
        <template v-if="acts">
            <MarkAction :label="mark.action" :open="Boolean(isOpen)" @click.stop="act" />
        </template>
        <template v-if="(mark.figure || mark.counting) && running">
            <span class="bar">
                <span class="progress" :style="{width: `${Math.round((mark.fraction || 0) * 100)}%`, background: barShade}"></span>
            </span>
        </template>
        <template v-if="mark.detail && !folded">
            <TextDisplay class="detail" :text="mark.detail" inline :row-names="false" />
        </template>
        <template v-if="mark.body && !folded">
            <div class="detail body">
                <template v-if="mark.bodyLabel">
                    <p class="body-label">{{ mark.bodyLabel }}</p>
                </template>
                <TextDisplay :text="mark.body" :row-names="false" />
            </div>
        </template>
        <template v-if="mark.command && !folded">
            <code class="detail command" :title="mark.command">{{ mark.command }}</code>
        </template>
        <template v-if="mark.card">
            <TextDisplay class="card" :text="mark.card" :row-names="false" />
        </template>
        <slot :shown="!folded" />
    </div>
</template>

<style scoped>
.mark.nested {
    position: relative;
    margin-left: calc(var(--depth) * 18px);
    overflow: visible;
}

.mark.nested::before {
    content: "";
    position: absolute;
    top: -3px;
    bottom: -3px;
    left: -8px;
    width: 1px;
    background: var(--border-3);
}

.mark {
    display: inline-grid;
    grid-template-columns: minmax(0, 1fr) auto;
    row-gap: 1px;
    align-items: center;
    /* the title row stays at the top of a mark held taller than its rows while it closes */
    align-content: start;
    max-width: 100%;
    padding: 2px 6px;
    border: 1px solid transparent;
    border-radius: 7px;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 11.5px;
    line-height: 1.45;
    text-align: left;
    transition:
        background 0.15s ease,
        border-color 0.15s ease;
}

/* work still running is outlined */
.mark.w-process {
    padding: 3px 9px;
    border-color: var(--border-2);
}

/* what needs the user, a failure, a warning or a request, is filled in its colour */
.mark.w-attention {
    padding: 5px 10px;
    border-color: color-mix(in srgb, var(--mark, var(--danger)) 42%, var(--border-2));
    background: color-mix(in srgb, var(--mark, var(--danger)) 8%, transparent);
    color: var(--text-2);
}

/* the mark's line: its icon, its words with the fold sign, and its status; the button that opens, folds or acts */
.top {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    column-gap: 7px;
    align-items: center;
    min-width: 0;
    padding: 0;
    border: 0;
    outline: none;
    background: none;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: inherit;
}

.mark:has(> .top:focus-visible) {
    outline: 2px solid color-mix(in srgb, var(--accent-text) 70%, transparent);
    outline-offset: 1px;
}

.mark.live {
    cursor: pointer;
}

.mark.worked .top {
    grid-template-columns: auto auto minmax(0, 1fr) auto;
}

/* an opened mark grows wider to the room its contents need */
.mark[data-open],
.mark.open:not([data-folded]) {
    width: min(560px, 100%);
}

.mark[data-open] .head,
.mark[data-open] .head :deep(.md) {
    white-space: normal;
}

/* while a mark opens or closes (composables/markMotion.js) its contents fade out and stay out until it has its new size, so no text
   wraps as it moves; its top row stays, and its title stays on one line through every step */
.mark > :not(.top, .mact, .bar) {
    transition: opacity 0.16s ease;
}

.mark.leaving > :not(.top, .mact, .bar) {
    opacity: 0;
    transition-duration: 0.12s;
}

.mark.resizing {
    overflow: hidden;
}

.mark.resizing > :not(.top, .mact, .bar) {
    visibility: hidden;
    opacity: 0;
}

.mark.leaving .head,
.mark.leaving .head :deep(.md),
.mark.resizing .head,
.mark.resizing .head :deep(.md),
.mark.entering:not([data-open]) .head,
.mark.entering:not([data-open]) .head :deep(.md) {
    white-space: nowrap;
}

/* a mark that closes keeps its title as it was while its contents fade out, so nothing jumps before the resize; and a mark that opens lets its
   title wrap once it has its size, as the box was measured for it */
.mark.leaving.folding .head,
.mark.leaving.folding .head :deep(.md) {
    white-space: normal;
}

.mark.entering > :not(.top, .mact, .bar) {
    animation: arrive 0.16s ease;
}

@keyframes arrive {
    from {
        opacity: 0;
    }
}

.mark.live.w-event:hover {
    --fold-bg: var(--hover);
    background: var(--hover);
}

/* the fold sign of a mark that opens in place shows while pointed at and once open */
.mark .fold {
    width: 10px;
    height: 10px;
    margin-left: 0;
    opacity: 0;
}

.mark .fold :deep(svg) {
    width: 10px;
    height: 10px;
}

.mark:hover .fold,
.mark:focus-within .fold,
.mark.open .fold {
    opacity: 1;
}

.mark .top:hover .fold {
    color: var(--text-2);
}

/* the one-click action: shown on a quiet line while pointed at, always on running work past a divider, in the mark's colour on what
   needs the user, and in words once the mark is open */
.mark .mact {
    opacity: 0;
}

.mark:hover .mact,
.mark:focus-within .mact,
.mark.open .mact {
    opacity: 1;
}

.mark.w-process .mact {
    margin-left: 11px;
    color: var(--text-4);
    opacity: 1;
}

.mark.w-process .mact::before {
    content: "";
    position: absolute;
    top: 3px;
    bottom: 3px;
    left: -6px;
    width: 1px;
    background: var(--border-2);
}

.mark.w-process .mact:hover {
    color: var(--text);
}

.mark.w-attention .mact {
    color: var(--mark, var(--danger));
    opacity: 1;
}

.mark.w-attention .mact:hover {
    background: color-mix(in srgb, var(--mark, var(--danger)) 18%, transparent);
    color: var(--mark, var(--danger));
}

.mark.open:not(.w-attention) .mact {
    color: var(--text-2);
}

/* a phone has no hover: the action always shows, quiet on a quiet line, and the fold sign only once a mark is open */
:global(html.phone .mark .mact) {
    opacity: 1;
}

:global(html.phone .mark.w-event .mact) {
    color: var(--text-4);
}

:global(html.phone .mark:not(.open) .fold) {
    display: none;
}

@media (hover: none) {
    .mark .mact {
        opacity: 1;
    }

    .mark.w-event .mact {
        color: var(--text-4);
    }

    .mark:not(.open) .fold {
        display: none;
    }
}

.mark .agent-icon {
    display: inline-flex;
    align-self: start;
}

.mark .ico {
    align-self: start;
    width: 13px;
    height: 13px;
    margin-top: 2px;
}

.mark.tinted .ico {
    color: var(--mark);
}

.mark:has(.progress) {
    position: relative;
}

/* the status at the end of a mark: its figure, how long it ran, whether it is in the dock, and its sign */
.status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding-left: 4px;
    color: var(--text-4);
    font-size: 10.5px;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
}

.status .sign {
    width: 11px;
    height: 11px;
    color: var(--mark, var(--text-3));
    stroke-width: 1.8;
}

/* a run the user stopped ends on a small grey square */
.status .sign.stopped {
    width: 9px;
    height: 9px;
    color: var(--text-3);
}

/* while a run stops, its ring turns grey */
.mark.stopping .spin {
    border-color: color-mix(in srgb, var(--text-3) 30%, transparent);
    border-top-color: var(--text-3);
}

.spin {
    width: 9px;
    height: 9px;
    border: 1.5px solid color-mix(in srgb, var(--mark, var(--tone-work)) 30%, transparent);
    border-top-color: var(--mark, var(--tone-work));
    border-radius: 50%;
    animation: spin 0.9s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.mark.failed {
    border-color: color-mix(in srgb, var(--danger) 48%, var(--border-2));
    background: color-mix(in srgb, var(--danger) 9%, transparent);
}

.mark.struck .head {
    text-decoration: line-through;
    text-decoration-color: var(--text-4);
}

/* the progress line lies along the mark's foot, inside its rounded corners */
.bar {
    position: absolute;
    inset: 0;
    overflow: hidden;
    border-radius: 6px;
    pointer-events: none;
}

.progress {
    position: absolute;
    bottom: 0;
    left: 0;
    display: block;
    height: 2px;
    opacity: 0.85;
    transition: width 0.5s ease;
}

.worker {
    padding-left: 6px;
    border-left: 1px solid var(--border-2);
    color: var(--text-2);
    white-space: nowrap;
}

.head {
    display: flex;
    align-items: baseline;
    gap: 5px;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* what joined a group mark since it was last opened */
.news {
    color: var(--accent-text);
}

.settled {
    color: var(--tone-good);
    font-weight: 600;
}

.mark.console .head {
    margin: 0 -9px;
    padding: 0 9px 3px;
    border-bottom: 1px solid var(--border-2);
}

.head :deep(.md) {
    overflow: hidden;
    color: inherit;
    line-height: inherit;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.mark .head :deep(code) {
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    padding: 0 6px;
    text-overflow: ellipsis;
    vertical-align: bottom;
    white-space: nowrap;
    border-radius: 4px;
    background: var(--chip);
    color: var(--text-2);
    font-size: 10.5px;
}

/* the title keeps its full width and the name beside it takes what is left, and is the one that is cut short */
.head .title {
    flex: none;
    max-width: 100%;
}

.head strong {
    min-width: 0;
    overflow: hidden;
    color: var(--text-2);
    font-weight: 500;
    text-overflow: ellipsis;
}

.mark .detail :deep(.row-pill) {
    font-family: inherit;
    line-height: inherit;
}

.mark .detail :deep(.row-pill .ico) {
    width: 10px;
    height: 10px;
}

.mark .command {
    min-width: 0;
    overflow: hidden;
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.mark .card {
    grid-column: 1 / -1;
    font-size: 13px;
}

.mark .card :deep(.row-card) {
    margin: 5px 0 2px;
}

.mark .detail {
    grid-column: 1 / -1;
    padding-left: 20px;
    color: var(--text-2);
    font-size: 12px;
    line-height: 1.45;
    overflow-wrap: anywhere;
    white-space: normal;
}

/* an opened mark grows in place to its text, each label above the text it names */
.mark .body {
    padding-bottom: 4px;
    color: var(--text-2);
    font-size: 12px;
}

.body-label {
    margin: 6px 0 2px;
    color: var(--text-4);
    font-size: 10.5px;
}
</style>
