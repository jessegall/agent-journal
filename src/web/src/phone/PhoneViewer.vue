<script setup>
import {computed, inject, nextTick, onMounted, ref} from "vue";
import {phone} from "../api/phone.js";
import Icon from "../kit/Icon.vue";
import Spinner from "../kit/Spinner.vue";
import {ended} from "./outbox.js";

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

onMounted(load);
</script>

<template>
    <section class="viewer">
        <header class="viewer-bar">
            <button type="button" class="viewer-back" @click="emit('close')"><Icon name="back" :size="16" /> {{ back }}</button>
            <span class="viewer-name">{{ path }}</span>
        </header>
        <div ref="body" class="viewer-body">
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
    align-items: center;
    gap: 12px;
    min-height: 48px;
    max-width: none;
    margin: 0 calc(-1 * var(--side));
    padding: 0 var(--side);
    border-bottom: 1px solid var(--line);
}

.viewer-back {
    display: flex;
    flex: none;
    align-items: center;
    gap: 6px;
    min-height: 44px;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-2);
    font: inherit;
}

.viewer-name {
    overflow: hidden;
    color: var(--text-3);
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.viewer-body {
    flex: 1;
    min-height: 0;
    overflow: auto;
    padding: 10px 0 24px;
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
    font-size: 12.5px;
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
    font-size: 14px;
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
