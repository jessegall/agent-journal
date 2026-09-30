<script setup>
import {computed} from "vue";
import PhoneQuestion from "./PhoneQuestion.vue";
import PhoneActions from "./PhoneActions.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import Icon from "../kit/Icon.vue";
import ReadTicks from "../kit/ReadTicks.vue";
import ChatMark from "../kit/ChatMark.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import {clock} from "../format/time.js";

const props = defineProps({item: {type: Object, required: true}, fresh: {type: Boolean, default: false}, briefs: {type: Map, default: () => new Map()}});
const files = computed(() => Object.keys(props.item.files || {}));
const PICTURES = /\.(png|jpe?g|gif|webp)$/i;
const picture = (name) => PICTURES.test(name);
const fileUrl = (name) => `./file/${props.item.type}/${props.item.n}/${encodeURIComponent(name)}`;
const elsewhere = computed(() => props.item.who === "user" && !String(props.item.data?.via || "").startsWith("phone:"));
const NAMES = {todo: "to-do", doc: "document"};
const FILED_REF = /\b([a-z_]+)[ :](\d+)\b/g;
const filedAs = computed(
    () => new Set((props.item.sections || []).flatMap((part) => [...part.body.matchAll(FILED_REF)].map((found) => `${found[1]}:${found[2]}`))),
);
const filed = computed(() => (props.item.who === "user" ? (props.item.refs || []).filter((ref) => filedAs.value.has(ref)) : []));
const about = computed(() => (props.item.who === "user" ? (props.item.refs || []).find((ref) => !filedAs.value.has(ref)) : undefined));
const named = (ref) => `${NAMES[ref.split(":")[0]] || ref.split(":")[0]} ${ref.split(":")[1]}`;
const faces = computed(() => [...new Set((props.item.reactions || []).map((r) => r.face))]);
const holdable = computed(() => props.item.type === "message");
const quoted = computed(() => (about.value ? props.briefs.get(about.value) || "" : ""));
const emit = defineEmits(["hold"]);
const pressed = (event) => emit("hold", props.item, event.currentTarget.closest(".turn").getBoundingClientRect());
</script>

<template>
    <SwitchCase :value="item.type">
        <template #question>
            <PhoneQuestion :question="item" />
        </template>
        <template #thought>
            <TextDisplay :class="['turn-thought', {fresh}]" :text="item.label" />
        </template>
        <template #card>
            <div :class="['turn-card', {fresh}]">
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
            <div :class="['turn', item.who, {fresh}]" :data-hold="holdable ? item.type + item.n : undefined" @contextmenu.prevent="pressed">
                <template v-if="holdable">
                    <span class="turn-reply" aria-hidden="true"><Icon name="reply" :size="16" /></span>
                </template>
                <template v-if="item.who !== 'user'">
                    <span class="turn-who">
                        Agent, {{ clock(item.created) }}
                        <template v-if="holdable">
                            <PhoneActions @press="pressed" />
                        </template>
                    </span>
                </template>
                <template v-if="quoted">
                    <a class="turn-quote" href="#" :data-peek="about" :aria-label="`Reply to: ${quoted}`">{{ quoted }}</a>
                </template>
                <template v-else-if="about">
                    <a class="turn-about" href="#" :data-peek="about">About {{ named(about) }}</a>
                </template>
                <TextDisplay :text="item.brief || item.title" />
                <template v-for="part in item.sections || []" :key="part.title">
                    <h3 class="turn-part">{{ part.title }}</h3>
                    <TextDisplay :text="part.body" />
                </template>
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
                    <span class="turn-faces">{{ faces.join(" ") }}</span>
                </template>
                <template v-if="item.who === 'user'">
                    <span class="turn-meta">
                        <template v-if="elsewhere">from desktop ·</template>
                        {{ clock(item.created) }}
                        <ReadTicks :message="item" />
                        <template v-if="holdable">
                            <PhoneActions @press="pressed" />
                        </template>
                    </span>
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
    align-self: flex-end;
    background: var(--accent-dim);
}

.turn.agent {
    align-self: flex-start;
    background: var(--raised);
}

.turn.user + .turn.user,
.turn.agent + .turn.agent {
    margin-top: -8px;
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

.fresh {
    animation: turn-in 200ms ease-out;
}

@keyframes turn-in {
    from {
        opacity: 0;
        transform: translateY(8px);
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
}
</style>
