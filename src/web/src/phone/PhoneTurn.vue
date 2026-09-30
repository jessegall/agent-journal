<script setup>
import {computed} from "vue";
import PhoneQuestion from "./PhoneQuestion.vue";
import PhoneActions from "./PhoneActions.vue";
import PhoneFold from "./PhoneFold.vue";
import {splitQuote} from "./quoted.js";
import SwitchCase from "../kit/SwitchCase.vue";
import Icon from "../kit/Icon.vue";
import PhoneTicks from "./PhoneTicks.vue";
import ChatMark from "../kit/ChatMark.vue";
import TextDisplay from "../kit/TextDisplay.vue";
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
const PICTURES = /\.(png|jpe?g|gif|webp)$/i;
const picture = (name) => PICTURES.test(name);
const fileUrl = (name) => `./file/${props.item.type}/${props.item.n}/${encodeURIComponent(name)}`;
const elsewhere = computed(() => props.item.who === "user" && !String(props.item.data?.via || "").startsWith("phone:"));
const FILED_REF = /\b([a-z_]+)[ :](\d+)\b/g;
const filedAs = computed(
    () => new Set((props.item.sections || []).flatMap((part) => [...part.body.matchAll(FILED_REF)].map((found) => `${found[1]}:${found[2]}`))),
);
const filed = computed(() => (props.item.who === "user" ? (props.item.refs || []).filter((ref) => filedAs.value.has(ref)) : []));
const IN_CHAT = /^(message|comment):/;
const parent = computed(() =>
    props.item.type === "comment" && !(props.item.refs || []).some((ref) => IN_CHAT.test(ref)) ? (props.item.refs || []).find((ref) => ref.includes(":")) : undefined,
);
const about = computed(() => (props.item.who === "user" && !parent.value ? (props.item.refs || []).find((ref) => !filedAs.value.has(ref)) : undefined));
const named = (ref) => `${kindWord(ref.split(":")[0])} ${ref.split(":")[1]}`;
const faces = computed(() => [...new Set((props.item.reactions || []).map((r) => r.face))]);
const HOLDABLE = ["message", "comment"];
const holdable = computed(() => HOLDABLE.includes(props.item.type));
const arriving = computed(() => props.arrive >= 0);
const inline = computed(() => splitQuote(props.item.brief || props.item.title));
const arrival = computed(() => (arriving.value ? {"--arrive-delay": `${props.arrive}ms`} : undefined));
const onlyFiles = computed(() => files.value.length > 0 && (props.item.brief || props.item.title || "").trim() === `Sent ${files.value.join(", ")}`);
const quoted = computed(() => (about.value ? props.briefs.get(about.value) || "" : ""));
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
                <ChatMark
                    :icon="item.icon"
                    :tone="item.tone"
                    :color="item.color"
                    :label="item.label"
                    :name="item.name"
                    :detail="item.detail"
                    :state="item.state"
                    :command="item.command"
                    :at="item.created"
                />
            </div>
        </template>
        <template #default>
            <div :class="['turn', item.who, {arriving, joined}]" :style="arrival" :data-hold="holdable ? item.type + item.n : undefined" @contextmenu.prevent="pressed">
                <template v-if="holdable">
                    <span class="turn-reply" aria-hidden="true"><Icon name="reply" :size="16" /></span>
                </template>
                <template v-if="item.who !== 'user' && !joined">
                    <span class="turn-who">
                        Agent, {{ clock(item.created) }}
                    </span>
                </template>
                <template v-if="quoted">
                    <a class="turn-quote" href="#" :data-peek="about" :aria-label="`Reply to: ${quoted}`">{{ quoted }}</a>
                </template>
                <template v-else-if="about">
                    <a class="turn-about" href="#" :data-peek="about">About {{ named(about) }}</a>
                </template>
                <template v-if="parent">
                    <a class="turn-about" href="#" :data-peek="parent">on {{ named(parent) }}</a>
                </template>
                <template v-if="inline.quote && !quoted">
                    <p class="turn-quote"><span class="phone-hidden">Reply to: </span>{{ inline.quote }}</p>
                </template>
                <PhoneFold>
                    <template v-if="!onlyFiles">
                        <TextDisplay :text="inline.body || item.brief || item.title" />
                    </template>
                    <template v-for="part in item.sections || []" :key="part.title">
                        <h3 class="turn-part">{{ part.title }}</h3>
                        <TextDisplay :text="part.body" />
                    </template>
                </PhoneFold>
                <template v-if="files.length">
                    <span class="turn-files">
                        <template v-for="name in files" :key="name">
                            <a class="turn-file" :href="fileUrl(name)" :data-peek="`attachment:${item.type}/${item.n}/${encodeURIComponent(name)}`">
                                <template v-if="picture(name)">
                                    <img class="turn-picture" :src="fileUrl(name)" :alt="name" loading="lazy" />
                                </template>
                                <template v-else>
                                    <Icon name="paperclip" :size="12" />
                                    {{ name }}
                                </template>
                            </a>
                        </template>
                    </span>
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
                    <span :key="faces.join('')" class="turn-faces">{{ faces.join(" ") }}</span>
                </template>
                <template v-if="item.who === 'user' && !continues">
                    <span class="turn-meta">
                        <template v-if="elsewhere">from desktop ·</template>
                        {{ clock(item.created) }}
                        <PhoneTicks :message="item" />
                    </span>
                </template>
                <template v-if="holdable">
                    <PhoneActions :class="['turn-actions', item.who === 'user' ? 'at-foot' : 'at-head', {quiet: item.who === 'user' ? continues : joined}]" @press="pressed" />
                </template>
            </div>
        </template>
    </SwitchCase>
</template>

<style scoped>
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

.turn.user :deep(a) {
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

.turn-part {
    margin: 10px 0 4px;
    font-size: 1rem;
    font-weight: 600;
}

.turn-quote {
    display: -webkit-box;
    margin: 0 0 6px;
    padding: 4px 10px;
    overflow: hidden;
    border-left: 3px solid var(--accent);
    border-radius: 4px;
    background: color-mix(in oklab, var(--bg) 40%, transparent);
    color: var(--text-2);
    font-size: 0.824rem;
    line-height: 1.3;
    text-decoration: none;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
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
    align-self: center;
    max-width: 100%;
    min-width: 0;
    margin: -4px 0;
}

.turn-card :deep(.mark) {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 2px 6px;
    font-size: 0.706rem;
    text-align: center;
}

@keyframes face-in-spring {
    from {
        transform: scale(0.5);
        opacity: 0;
    }
}

@keyframes face-in {
    from {
        transform: scale(0.6);
        opacity: 0;
    }
}

.turn-about {
    display: inline-block;
    margin-bottom: 4px;
    color: var(--accent-text);
    font-size: 0.706rem;
    text-decoration: none;
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

.turn-faces {
    animation: face-in-spring 220ms var(--spring);
    display: inline-block;
    margin-top: 6px;
    padding: 1px 7px;
    border-radius: 9px;
    background: var(--bg);
    font-size: 0.824rem;
}

.turn-files {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    margin-top: 6px;
    color: var(--text-2);
    font-size: 0.765rem;
}

.turn-file {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--accent-text);
}

.turn-picture {
    display: block;
    max-width: 200px;
    max-height: 200px;
    border-radius: 8px;
    object-fit: cover;
}

.turn-meta {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    margin-top: 4px;
    color: var(--text-2);
    font-size: 0.706rem;
    padding-right: 26px;
}
</style>
