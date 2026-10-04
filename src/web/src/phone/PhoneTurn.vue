<script setup>
import {computed} from "vue";
import PhoneButtons from "./PhoneButtons.vue";
import PhoneQuestion from "./PhoneQuestion.vue";
import {allButtons} from "../domain/buttons.js";
import PhoneActions from "./PhoneActions.vue";
import {splitQuote} from "./quoted.js";
import SwitchCase from "../kit/SwitchCase.vue";
import Icon from "../kit/Icon.vue";
import PhoneMark from "./PhoneMark.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import PhonePeer from "./PhonePeer.vue";
import PhoneQuote from "./PhoneQuote.vue";
import PhoneParent from "./PhoneParent.vue";
import PhoneBody from "./PhoneBody.vue";
import PhoneFiles from "./PhoneFiles.vue";
import PhoneReactions from "./PhoneReactions.vue";
import PhoneMeta from "./PhoneMeta.vue";
import {EARLIER, IN_CHAT, answered} from "../domain/replies.js";
import {clock} from "../format/time.js";
import {kindWord} from "./kinds.js";

const props = defineProps({
    item: {type: Object, required: true},
    arrive: {type: Number, default: -1},
    briefs: {type: Map, default: () => new Map()},
    joined: {type: Boolean, default: false},
    continues: {type: Boolean, default: false},
});
const files = computed(() => Object.keys(props.item.files || {}));
const buttons = computed(() => (props.item.data ? allButtons(props.item) : []));
const elsewhere = computed(() => props.item.who === "user" && !String(props.item.data?.via || "").startsWith("phone:"));
const FILED_REF = /\b([a-z_]+)[ :](\d+)\b/g;
const filedAs = computed(
    () =>
        new Set((props.item.sections || []).flatMap((part) => [...part.body.matchAll(FILED_REF)].map((found) => `${found[1]}:${found[2]}`)))
);
const filed = computed(() => (props.item.who === "user" ? (props.item.refs || []).filter((ref) => filedAs.value.has(ref)) : []));
const parent = computed(() =>
    props.item.type === "comment" && !(props.item.refs || []).some((ref) => IN_CHAT.test(ref))
        ? (props.item.refs || []).find((ref) => ref.includes(":"))
        : undefined
);
const answers = computed(() => answered(props.item));
const about = computed(() =>
    props.item.who === "user" && !parent.value && !answers.value
        ? (props.item.refs || []).find((ref) => !filedAs.value.has(ref))
        : undefined
);
const named = (ref) => `${kindWord(ref.split(":")[0])} ${ref.split(":")[1]}`;
const aboutLabel = computed(() => (about.value ? named(about.value).replace(/^./, (first) => first.toUpperCase()) : ""));
const parentLabel = computed(() => (parent.value ? named(parent.value) : ""));
const faces = computed(() => [...new Set((props.item.reactions || []).map((r) => r.face))]);
const between = computed(() => Boolean(props.item.data?.sent_to || props.item.data?.peer));
const betweenLabel = computed(() => {
    if (props.item.data?.peer) return `From ${props.item.data.peer}`;
    const name = String(props.item.to || "")
        .split(":")[0]
        .trim();
    return `To ${name || "a helper"}`;
});
const HOLDABLE = ["message", "comment"];
const holdable = computed(() => HOLDABLE.includes(props.item.type));
const arriving = computed(() => props.arrive >= 0);
const inline = computed(() => splitQuote(props.item.brief || props.item.title));
const arrival = computed(() => (arriving.value ? {"--arrive-delay": `${props.arrive}ms`} : undefined));
const onlyFiles = computed(
    () => files.value.length > 0 && (props.item.brief || props.item.title || "").trim() === `Sent ${files.value.join(", ")}`
);
const quoted = computed(() => (answers.value ? props.briefs.get(answers.value) || EARLIER : ""));
const emit = defineEmits(["hold"]);
function pressed(event) {
    if (!holdable.value) return;
    const bubble = event.currentTarget.closest(".turn");
    emit("hold", props.item, bubble.getBoundingClientRect(), bubble);
}
</script>

<template>
    <SwitchCase :value="item.type">
        <template #question>
            <PhoneQuestion :class="{arriving}" :style="arrival" :question="item" />
        </template>
        <template #thought>
            <TextDisplay :class="['turn-thought', {arriving}]" :style="arrival" :text="item.label" />
        </template>
        <template #card>
            <div :class="['turn-card', {arriving}]" :style="arrival">
                <PhoneMark :item="item" />
            </div>
        </template>
        <template #default>
            <div
                :class="['turn', between ? 'peer' : item.who, {arriving, joined}]"
                :style="arrival"
                :data-hold="holdable ? item.type + item.n : undefined"
                :data-noswipe="between ? '' : undefined"
                @contextmenu.prevent="pressed"
            >
                <template v-if="holdable">
                    <span class="turn-reply" aria-hidden="true"><Icon name="reply" :size="16" /></span>
                </template>
                <template v-if="between">
                    <PhonePeer :label="betweenLabel" />
                </template>
                <template v-else-if="item.who !== 'user' && !joined">
                    <span class="turn-who">Agent, {{ clock(item.created) }}</span>
                </template>
                <PhoneQuote :quoted="quoted" :about="answers || about" :about-label="aboutLabel" :inline-quote="inline.quote" />
                <template v-if="parent">
                    <PhoneParent :target="parent" :label="parentLabel" />
                </template>
                <PhoneBody :body="inline.body || item.brief || item.title" :sections="item.sections || []" :only-files="onlyFiles" />
                <template v-if="files.length">
                    <PhoneFiles :type="item.type" :n="item.n" :files="files" />
                </template>
                <template v-if="buttons.length">
                    <div class="turn-buttons">
                        <PhoneButtons :row="item" />
                    </div>
                </template>
                <template v-if="filed.length">
                    <span class="turn-filed">
                        Filed
                        <template v-for="ref in filed" :key="ref">
                            <a class="turn-chip" href="#" :data-peek="ref">{{ named(ref) }}</a>
                        </template>
                    </span>
                </template>
                <template v-if="faces.length">
                    <PhoneReactions :faces="faces" />
                </template>
                <template v-if="item.who === 'user' && !continues && !between">
                    <PhoneMeta :item="item" :elsewhere="elsewhere" />
                </template>
                <template v-if="holdable">
                    <PhoneActions
                        :class="[
                            'turn-actions',
                            item.who === 'user' && !between ? 'at-foot' : 'at-head',
                            {quiet: item.who === 'user' ? continues : joined},
                        ]"
                        @press="pressed"
                    />
                </template>
            </div>
        </template>
    </SwitchCase>
</template>

<style scoped>
.turn-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 8px;
}

.turn {
    position: relative;
    max-width: 78%;
    padding: 8px 12px;
    border-radius: 18px;
    line-height: 1.35;
    overflow-wrap: anywhere;
    transition: transform 300ms var(--spring);
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
}

.turn :deep(*) {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
}

.turn.user {
    --text: #fff;
    --text-2: #fff;
    --text-3: #fff;
    --text-4: rgb(255 255 255 / 80%);
    --accent-text: #fff;
    --border: rgb(255 255 255 / 30%);
    --border-2: rgb(255 255 255 / 40%);
    --line: rgb(255 255 255 / 25%);
    --hover: rgb(255 255 255 / 16%);
    --code-bg: rgb(0 0 0 / 18%);
    align-self: flex-end;
    background: var(--accent);
    color: #fff;
}

.turn.user :deep(a:not(.turn-quote)) {
    color: #fff;
    text-decoration: underline;
}

.turn.user .turn-reply {
    background: var(--raised);
    color: var(--accent);
}

.turn.agent {
    align-self: flex-start;
    background: var(--raised);
}

.turn :deep(.md > :last-child) {
    margin-bottom: 0;
}

.turn.joined {
    margin-top: -8px;
}

.turn.peer {
    align-self: stretch;
    max-width: none;
    padding: 7px 12px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: none;
    color: var(--text-3);
    font-size: 0.765rem;
    line-height: 1.45;
}

.turn-actions {
    position: absolute;
    right: -6px;
    margin: 0;
}

.turn-actions.at-head {
    top: -4px;
}

.turn-actions.at-foot {
    bottom: -5px;
}

.turn-actions.quiet {
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
}

.turn[data-pressing] {
    transform: scale(0.97);
    transition-duration: 150ms;
}

.turn[data-dragging] {
    transition: none;
    will-change: transform;
}

.turn-reply {
    position: absolute;
    top: 50%;
    left: -40px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    margin-top: -14px;
    border-radius: 50%;
    background: var(--hover);
    color: var(--text-2);
    opacity: var(--pull, 0);
    transform: scale(calc(0.6 + 0.4 * var(--pull, 0)));
}

.turn-who {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 2px;
    color: var(--text-2);
    font-size: 0.706rem;
    padding-right: 26px;
}

.turn-thought {
    align-self: flex-start;
    max-width: 78%;
    padding: 2px 12px;
    color: var(--text-3);
    font-size: 0.882rem;
    font-style: italic;
    line-height: 1.35;
}

.turn-card {
    align-self: flex-start;
    max-width: 100%;
    min-width: 0;
}

.turn-card :deep(.mark:not(.console)) {
    font-size: 0.706rem;
}

.turn-filed {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    margin-top: 6px;
    color: var(--text-3);
    font-size: 0.706rem;
}

.turn-chip {
    padding: 1px 7px;
    border: 1px solid var(--border-2);
    border-radius: 9px;
    color: var(--accent-text);
    text-decoration: none;
}
</style>
