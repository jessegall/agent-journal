<script setup>
import {computed, reactive, ref, watch} from "vue";
import {api} from "../api/client.js";
import {useTyping} from "../composables/reveal.js";
import {store} from "../state/store.js";
import InlineEdit from "../kit/InlineEdit.vue";
import SkeletonLine from "../kit/SkeletonLine.vue";
import Btn from "../kit/Btn.vue";

const props = defineProps({
    ticket: {type: Object, default: null},
    picked: Boolean,
    active: Boolean,
    paused: Boolean,
    order: Number,
    speed: {type: Number, default: 1},
    hurry: Boolean,
});
const emit = defineEmits(["toggle", "revealed", "more"]);
const TITLE_MS = 900;
const ABSTRACT_MS = 1600;
const HURRIED = 20;
const {type, wait} = useTyping();
const rate = () => (props.hurry ? HURRIED : props.speed);
const pause = (ms) => wait(ms / rate());
const shown = reactive({started: false, title: 0, owner: false, abstract: 0, done: false});
const title = computed(() => (props.ticket ? props.ticket.title : ""));
const abstract = computed(() => (props.ticket ? props.ticket.abstract : ""));
const origin = computed(() => (props.ticket && props.ticket.data.source !== "user" && props.ticket.data.source_id) || "");
const owner = computed(() => {
    const name = props.ticket ? props.ticket.data.owner : "";
    return name ? (store.board.roles.find((role) => role.name === name) || {title: name}).title : "";
});
const stage = computed(() => {
    if (shown.done) return "done";
    if (shown.started) return "writing";
    return props.paused ? "paused" : "waiting";
});
const TAGS = {waiting: "", paused: "Waits for your answer", writing: "Drafting", done: "Suggested ticket"};
const tag = computed(() => (stage.value === "done" && props.picked ? "Picked" : TAGS[stage.value]));
const TAG_BARS = [{width: "64px", height: 8}];
const OWNER_BARS = [{width: "30%", height: 8}];
const fields = computed(() => [
    {
        name: "title",
        text: shown.done ? title.value : title.value.slice(0, shown.title),
        typed: shown.title,
        caret: stage.value === "writing" && !shown.owner,
        bars: [
            {width: "78%", height: 12},
            {width: "44%", height: 12},
        ],
    },
    {
        name: "abstract",
        text: shown.done ? abstract.value : abstract.value.slice(0, shown.abstract),
        typed: shown.abstract,
        caret: stage.value === "writing" && shown.owner,
        bars: [
            {width: "100%", height: 9},
            {width: "62%", height: 9},
        ],
    },
]);
const still = computed(() => stage.value !== "waiting");
const editing = ref("");
const edit = (field) => shown.done && (editing.value = field);
const toggle = () => shown.done && !editing.value && emit("toggle");

async function reveal() {
    shown.started = true;
    await pause(200);
    await type(
        title.value,
        () => TITLE_MS / rate(),
        (at) => (shown.title = at)
    );
    await pause(120);
    shown.owner = true;
    await pause(160);
    await type(
        abstract.value,
        () => ABSTRACT_MS / rate(),
        (at) => (shown.abstract = at)
    );
    await pause(200);
    shown.done = true;
    emit("revealed");
}

watch(
    () => props.active && Boolean(props.ticket),
    (go) => go && !shown.started && reveal(),
    {immediate: true}
);

async function save(field, text) {
    editing.value = "";
    if (text && text !== props.ticket[field]) await api.act("ticket", props.ticket.n, "update", {[field]: text});
}
</script>

<template>
    <div
        :class="['pick', stage, `order-${order % 3}`, {picked}]"
        role="button"
        tabindex="0"
        :aria-pressed="picked"
        :data-ticket="ticket ? ticket.n : null"
        :title="shown.done ? 'Click to pick it; double-click its title or line to change them' : ''"
        @click="toggle"
        @keydown.space.prevent="toggle"
        @keydown.enter.prevent="toggle"
    >
        <span class="pick-top">
            <SkeletonLine :filled="Boolean(tag)" :still="still" :bars="TAG_BARS">
                <span :class="['tag', {faded: !tag}]">
                    <span class="tag-dot" />
                    {{ tag }}
                </span>
            </SkeletonLine>
            <span :class="['check', {on: picked}]">✓</span>
        </span>
        <template v-for="field in fields" :key="field.name">
            <SkeletonLine :class="`line-${field.name}`" :filled="field.typed > 0" :still="still" :bars="field.bars">
                <template v-if="field.typed">
                    <InlineEdit
                        :class="`pick-${field.name}`"
                        :text="field.text"
                        :editing="editing === field.name"
                        :caret="field.caret"
                        :typing="stage === 'writing'"
                        @start="edit(field.name)"
                        @save="(text) => save(field.name, text)"
                    />
                </template>
            </SkeletonLine>
        </template>
        <SkeletonLine class="line-owner" :filled="shown.owner" :still="still" :bars="OWNER_BARS">
            <template v-if="shown.owner && owner">
                <span class="owner">For {{ owner }}</span>
            </template>
        </SkeletonLine>
        <template v-if="shown.done && origin">
            <span class="origin" :title="`From ${ticket.data.source}`">{{ origin }}</span>
        </template>
        <template v-if="shown.done">
            <Btn small class="more" @click.stop="(e) => emit('more', e.currentTarget.closest('.pick').getBoundingClientRect())">
                More info
            </Btn>
        </template>
    </div>
</template>

<style scoped>
.origin {
    overflow: hidden;
    color: var(--text-4);
    font-family: var(--mono);
    font-size: 11px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.pick {
    display: flex;
    flex-direction: column;
    gap: 8px;
    height: 100%;
    padding: 14px 14px 12px;
    border: 1px solid var(--border-2);
    border-radius: 13px;
    background: rgba(28, 29, 33, 0.96);
    box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);
    color: var(--text);
    font: inherit;
    font-size: 13px;
    text-align: left;
    cursor: default;
    animation: rise 0.32s var(--ease) both;
    transition:
        border-color 0.2s,
        transform 0.25s var(--ease);
}

.pick.order-1 {
    animation-delay: 0.06s;
}

.pick.order-2 {
    animation-delay: 0.12s;
}

.pick.waiting,
.pick.paused {
    border-color: var(--border);
}

.pick.done {
    cursor: pointer;
}

.pick.done:hover {
    border-color: var(--border-3);
    transform: translateY(-2px);
}

.pick.picked,
.pick.picked:hover {
    border-color: var(--accent);
    box-shadow:
        0 0 0 1px var(--accent),
        0 18px 50px rgba(0, 0, 0, 0.35);
}

.pick-top {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: space-between;
    height: 20px;
}

.line-title {
    order: 1;
}

.line-owner {
    order: 2;
    height: 16px;
}

.line-abstract {
    order: 3;
}

.tag {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: var(--text-4);
    font-size: 11px;
    letter-spacing: 0.02em;
    transition: opacity 0.18s;
}

.pick.writing .tag,
.pick.done .tag {
    color: var(--text-3);
}

.tag-dot {
    width: 0;
    height: 6px;
    margin-right: -7px;
    border-radius: 50%;
    background: var(--progress);
    opacity: 0;
    transition:
        width 0.15s,
        margin 0.15s,
        opacity 0.15s;
}

.pick.writing .tag-dot {
    width: 6px;
    margin-right: 0;
    opacity: 1;
}

.check {
    display: grid;
    place-items: center;
    width: 20px;
    height: 20px;
    border: 1.5px solid var(--border-3);
    border-radius: 50%;
    color: transparent;
    font-size: 12px;
    transition:
        opacity 0.2s,
        background 0.2s,
        border-color 0.2s,
        color 0.2s;
}

.pick:not(.done) .check {
    opacity: 0;
}

.check.on {
    border-color: var(--accent);
    background: var(--accent);
    color: #fff;
}

.pick-title {
    font-size: 14px;
    font-weight: 500;
    line-height: 19px;
    overflow-wrap: anywhere;
}

.owner {
    color: var(--text-3);
    font-size: 12px;
    line-height: 16px;
    animation: fade-in 0.16s both;
}

.pick-abstract {
    color: var(--text-2);
    font-size: 12.5px;
    line-height: 18px;
    overflow-wrap: anywhere;
}

.more {
    order: 5;
    align-self: flex-start;
    margin-top: auto;
}

.faded {
    opacity: 0;
}

@keyframes fade-in {
    from {
        opacity: 0;
    }
}

@keyframes rise {
    from {
        opacity: 0;
        transform: translateX(18px);
    }
}
</style>
