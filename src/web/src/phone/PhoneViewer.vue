<script setup>
import {computed, inject, nextTick, onMounted, ref} from "vue";
import {phone} from "../api/phone.js";
import Icon from "../kit/Icon.vue";
import Spinner from "../kit/Spinner.vue";
import {ended} from "./outbox.js";
import {useUnder} from "./under.js";

const TEXT = /\.(txt|md|json|log|csv|ya?ml|toml|py|js|ts|vue|css|html|sh|sql|xml)$/i;
const PICTURE = /\.(png|jpe?g|gif|webp|heic)$/i;
const props = defineProps({target: {type: String, required: true}, back: {type: String, default: "Chat"}});
const emit = defineEmits(["close"]);
const failed = inject("phoneFailed");
const [kind, rest] = [props.target.split(":")[0], props.target.slice(props.target.indexOf(":") + 1)];
const [asked, wanted] = rest.split("#L");
const name = decodeURIComponent(asked.split("/").pop());
const url = kind === "attachment" ? `./file/${asked}` : "";
const text = ref(null);
const path = ref(name);
const told = ref("");
const body = ref(null);
const edge = ref(null);
const title = ref(null);
const under = useUnder(edge);
const picture = computed(() => kind === "attachment" && PICTURE.test(name));
const lines = computed(() => (text.value === null ? [] : text.value.split("\n")));
const line = Number(wanted) || 0;

async function load() {
    try {
        if (kind === "source") {
            const got = await phone.source(decodeURIComponent(asked));
            path.value = got.path;
            text.value = got.text;
        } else if (TEXT.test(name)) {
            text.value = await phone.attached(asked);
        }
    } catch (error) {
        if (ended(error)) failed(error);
        else told.value = error.message;
    }
    if (line) nextTick(() => body.value?.querySelector(`[data-line="${line}"]`)?.scrollIntoView({block: "center"}));
}

onMounted(() => {
    title.value?.focus({preventScroll: true});
    load();
});
</script>

<template>
    <section class="viewer">
        <header :class="['viewer-bar', {under}]">
            <button type="button" class="viewer-back" :aria-label="`Back to ${back}`" @click="emit('close')"><Icon name="back" :size="20" /> {{ back }}</button>
            <span ref="title" class="viewer-name" tabindex="-1">{{ path }}</span>
        </header>
        <div ref="body" class="viewer-body" data-scroller>
            <span ref="edge" class="viewer-edge" />
            <template v-if="told">
                <p class="viewer-told" role="status">{{ told }}</p>
            </template>
            <template v-else-if="picture">
                <img class="viewer-picture" :src="url" :alt="name" />
            </template>
            <template v-else-if="text !== null">
                <ol class="viewer-lines">
                    <template v-for="(words, i) in lines" :key="i">
                        <li :data-line="i + 1" :class="{here: i + 1 === line}">{{ words || " " }}</li>
                    </template>
                </ol>
            </template>
            <template v-else-if="url">
                <a class="viewer-download" :href="url" download>Download {{ name }}</a>
            </template>
            <template v-else>
                <div class="viewer-wait"><Spinner /></div>
            </template>
        </div>
    </section>
</template>

<style scoped>
.viewer {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
}

.viewer-bar {
    display: flex;
    flex: none;
    align-items: center;
    gap: 8px;
    min-height: 44px;
    max-width: none;
    margin: 0 calc(-1 * var(--side));
    padding: 0 var(--side) 0 8px;
    border-bottom: 1px solid transparent;
    transition: border-color 200ms linear;
}

.viewer-bar.under {
    border-bottom-color: var(--line);
}

.viewer-edge {
    display: block;
    height: 1px;
    margin-bottom: -1px;
}

.viewer-back {
    display: flex;
    flex: none;
    align-items: center;
    gap: 2px;
    min-height: 44px;
    padding: 0 6px;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    font-size: 1rem;
}

.viewer-name:focus {
    outline: none;
}

.viewer-name {
    overflow: hidden;
    color: var(--text-3);
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 0.706rem;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.viewer-body {
    flex: 1;
    min-height: 0;
    overflow: auto;
    overscroll-behavior: contain;
    padding: 10px 0 calc(24px + env(safe-area-inset-bottom));
}

.viewer-picture {
    display: block;
    width: 100%;
    border-radius: 10px;
}

.viewer-lines {
    margin: 0;
    padding: 0 0 0 3.2em;
    color: var(--text);
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 0.735rem;
    line-height: 1.55;
}

.viewer-lines li {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}

.viewer-lines li::marker {
    color: var(--text-4);
}

.viewer-lines li.here {
    background: var(--accent-dim);
}

.viewer-told,
.viewer-download {
    color: var(--text-2);
    font-size: 0.824rem;
}

.viewer-download {
    color: var(--accent-text);
}

.viewer-wait {
    display: flex;
    justify-content: center;
    padding: 24px;
}
</style>
