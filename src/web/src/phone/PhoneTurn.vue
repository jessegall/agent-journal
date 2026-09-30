<script setup>
import {computed, ref} from "vue";
import PhoneQuestion from "./PhoneQuestion.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import Icon from "../kit/Icon.vue";
import ReadTicks from "../kit/ReadTicks.vue";
import ChatMark from "../kit/ChatMark.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import {clock} from "../format/time.js";

const props = defineProps({item: {type: Object, required: true}});
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
const emit = defineEmits(["hold"]);
const HOLD_FOR = 450;
let timer = 0;
const pressing = ref(false);

function held() {
    pressing.value = false;
    navigator.vibrate?.(10);
    emit("hold", props.item);
}

function press() {
    pressing.value = true;
    timer = setTimeout(held, HOLD_FOR);
}

function release() {
    pressing.value = false;
    clearTimeout(timer);
}
</script>

<template>
    <SwitchCase :value="item.type">
        <template #question>
            <PhoneQuestion :question="item" />
        </template>
        <template #thought>
            <TextDisplay class="turn-thought" :text="item.label" />
        </template>
        <template #card>
            <div class="turn-card">
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
            <div
                :class="['turn', item.who, {pressing}]"
                @touchstart.passive="press"
                @touchend="release"
                @touchmove.passive="release"
                @contextmenu.prevent="emit('hold', item)"
            >
                <template v-if="item.who !== 'user'">
                    <span class="turn-who">Agent, {{ clock(item.created) }}</span>
                </template>
                <template v-if="about">
                    <a class="turn-about" href="#" :data-peek="about">About {{ named(about) }}</a>
                </template>
                <TextDisplay :text="item.brief || item.title" />
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
                    </span>
                </template>
            </div>
        </template>
    </SwitchCase>
</template>

<style scoped>
.turn {
    max-width: 88%;
    transition: transform 0.45s ease, opacity 0.45s ease;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
    padding: 10px 12px;
    border-radius: 12px;
    line-height: 1.5;
    overflow-wrap: anywhere;
}

.turn :deep(*) {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
}

.turn.user {
    align-self: flex-end;
    border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
    background: var(--accent-dim);
}

.turn.agent {
    align-self: stretch;
    max-width: 100%;
    border: 1px solid var(--border);
    background: var(--raised);
}

.turn-who {
    display: block;
    margin-bottom: 2px;
    color: var(--text-3);
    font-size: 12px;
}

.turn.pressing {
    transform: scale(0.97);
    opacity: 0.85;
}

.turn-thought {
    align-self: flex-start;
    max-width: 88%;
    padding: 7px 11px;
    border: 1px solid var(--border);
    border-radius: 9px;
    background: color-mix(in srgb, var(--raised) 50%, transparent);
    color: var(--text-4);
    font-size: 12.5px;
    font-style: italic;
    line-height: 1.5;
}

.turn-card {
    align-self: flex-start;
    max-width: 100%;
    min-width: 0;
}

.turn-about {
    display: inline-block;
    margin-bottom: 4px;
    color: var(--accent-text);
    font-size: 12px;
    text-decoration: none;
}

.turn-filed {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    margin-top: 6px;
    color: var(--text-3);
    font-size: 12px;
}

.turn-chip {
    padding: 1px 7px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    color: var(--accent-text);
    text-decoration: none;
}

.turn-faces {
    display: inline-block;
    margin-top: 6px;
    padding: 1px 7px;
    border-radius: 10px;
    background: var(--bg);
    font-size: 14px;
}

.turn-files {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    margin-top: 6px;
    color: var(--text-2);
    font-size: 13px;
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
    color: var(--text-3);
    font-size: 11.5px;
}
</style>
