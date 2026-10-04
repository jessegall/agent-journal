<script setup>
import {scrollIntoRoom} from "./reveal.js";
import {computed, inject, nextTick, onMounted, ref} from "vue";
import {phone} from "../api/phone.js";
import Icon from "../kit/Icon.vue";
import Spinner from "../kit/Spinner.vue";
import {ended} from "./outbox.js";
import {useUnder} from "./under.js";
import {highlight, languageOf} from "../text/highlight.js";
import {announce} from "./announce.js";
import PhoneMissing from "./PhoneMissing.vue";
import {useDrag} from "./drag.js";

const TEXT = /\.(txt|md|json|log|csv|ya?ml|toml|py|js|ts|vue|css|html|sh|sql|xml)$/i;
const PICTURE = /\.(png|jpe?g|gif|webp|heic)$/i;
const props = defineProps({target: {type: String, required: true}, back: {type: String, default: "Chat"}});
const emit = defineEmits(["close"]);
const failed = inject("phoneFailed");
const [kind, rest] = [props.target.split(":")[0], props.target.slice(props.target.indexOf(":") + 1)];
const [asked, wanted] = rest.split("#L");
const name = decodeURIComponent(asked.split("/").pop());
const url = kind === "attachment" ? phone.fileAt(asked) : "";
const text = ref(null);
const path = ref(name);
const told = ref("");
const body = ref(null);
const missing = ref(false);

function retry() {
    told.value = "";
    load();
}
const edge = ref(null);
const title = ref(null);
const under = useUnder(edge);
const picture = computed(() => kind === "attachment" && PICTURE.test(name));
const lines = computed(() =>
    text.value === null ? [] : highlight(text.value, languageOf(path.value)).map((html, i) => ({n: i + 1, html}))
);
const line = Number(wanted) || 0;

const ZOOM = 2.5;
const DOUBLE = 300;
const zoomed = ref(false);
const DISMISS = 120;
const FLICK = 0.5;
const pulled = ref(0);
const pulling = ref(false);
const stage = ref(null);
const shared = ref(null);
let lastTap = 0;

function tapped(event) {
    const now = Date.now();
    const pointer = event.detail > 0;
    if (pointer && now - lastTap > DOUBLE) {
        lastTap = now;
        return;
    }
    lastTap = 0;
    const rect = event.currentTarget.getBoundingClientRect();
    const [x, y] = pointer ? [(event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height] : [0.5, 0.5];
    zoomed.value = !zoomed.value;
    announce(zoomed.value ? "Zoomed in" : "Zoomed out");
    nextTick(() => {
        const box = stage.value;
        if (!box || !zoomed.value) return;
        box.scrollLeft = x * box.scrollWidth - box.clientWidth / 2;
        box.scrollTop = y * box.scrollHeight - box.clientHeight / 2;
    });
}

useDrag(body, {
    axis: "y",
    begin: () => (picture.value && !zoomed.value ? {} : null),
    accepts: (d) => d > 0,
    move: (d) => {
        pulling.value = true;
        pulled.value = Math.max(0, d);
    },
    end: (d, v) => {
        pulling.value = false;
        if (d > DISMISS || v > FLICK) return emit("close");
        pulled.value = 0;
    },
});

async function share() {
    try {
        await navigator.share({files: [shared.value], title: name});
    } catch (error) {
        if (error.name !== "AbortError") told.value = error.message;
    }
}

async function load() {
    if (picture.value && navigator.share) {
        phone
            .picture(asked, name)
            .then((file) => navigator.canShare?.({files: [file]}) && (shared.value = file))
            .catch(() => {});
    }
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
        else {
            missing.value = error.status === 404;
            told.value = error.message || "Not found";
        }
    }
    if (line) nextTick(() => scrollIntoRoom(body.value, body.value?.querySelector(`[data-line="${line}"]`), true));
}

onMounted(() => {
    title.value?.focus({preventScroll: true});
    load();
});
</script>

<template>
    <section class="viewer">
        <header :class="['viewer-bar', {under}]">
            <button type="button" class="viewer-back" :aria-label="`Back to ${back}`" @click="emit('close')">
                <Icon name="chevronRight" bold facing="left" :size="18" />
                {{ back }}
            </button>
            <span ref="title" :class="['viewer-name', {plain: picture}]" tabindex="-1">{{ path }}</span>
            <template v-if="shared">
                <button type="button" class="viewer-action" @click="share">Share</button>
            </template>
            <template v-else-if="picture">
                <a class="viewer-action" :href="url" :download="name">Save</a>
            </template>
        </header>
        <div ref="body" :class="['viewer-body', {dark: picture}]" data-scroller>
            <span ref="edge" class="viewer-edge" />
            <template v-if="told">
                <PhoneMissing
                    :title="missing ? 'This file isn\'t available' : 'This file couldn\'t be loaded'"
                    :words="missing ? `${name} could not be found on your computer.` : told"
                    :back="back"
                    @back="emit('close')"
                >
                    <template v-if="!missing">
                        <button type="button" @click="retry">Try again</button>
                    </template>
                </PhoneMissing>
            </template>
            <template v-else-if="picture">
                <div
                    ref="stage"
                    :class="['viewer-stage', {zoomed, pulling}]"
                    :style="{transform: pulled ? `translateY(${pulled}px)` : '', opacity: pulled ? Math.max(0.3, 1 - pulled / 400) : ''}"
                >
                    <button
                        type="button"
                        class="viewer-zoom"
                        :aria-pressed="zoomed"
                        :aria-label="zoomed ? 'Zoom out' : 'Zoom in'"
                        :style="{width: zoomed ? `${ZOOM * 100}%` : '100%'}"
                        @click="tapped"
                    >
                        <img class="viewer-picture" :src="url" :alt="name" @error="((missing = true), (told = 'Not found'))" />
                    </button>
                </div>
            </template>
            <template v-else-if="text !== null">
                <div class="viewer-code">
                    <ol class="viewer-lines" :style="{'--digits': String(lines.length).length}">
                        <template v-for="one in lines" :key="one.n">
                            <li :data-line="one.n" :class="{here: one.n === line}">
                                <span class="viewer-n" aria-hidden="true">{{ one.n }}</span>
                                <code class="viewer-text" v-html="one.html || ' '" />
                            </li>
                        </template>
                    </ol>
                </div>
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
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 10px 0 calc(24px + env(safe-area-inset-bottom));
}

.viewer-body.dark {
    padding: 0;
    overflow: hidden;
    background: #000;
}

.viewer-stage {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    max-width: none;
    overflow: hidden;
    padding-bottom: env(safe-area-inset-bottom);
}

.viewer-stage {
    transition:
        transform 300ms var(--spring),
        opacity 200ms ease-out;
}

.viewer-stage.pulling {
    transition: none;
}

.viewer-stage.zoomed {
    display: block;
    overflow: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
}

.viewer-zoom {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: none;
    height: 100%;
    padding: 0;
    border: 0;
    background: none;
    touch-action: manipulation;
}

.viewer-stage.zoomed .viewer-zoom {
    height: auto;
}

.viewer-picture {
    display: block;
    width: 100%;
    max-width: none;
    height: auto;
    max-height: 100%;
    object-fit: contain;
}

.viewer-stage.zoomed .viewer-picture {
    max-height: none;
}

.viewer-name.plain {
    color: var(--text-2);
    font-family: var(--font);
    font-size: 0.882rem;
}

.viewer-action {
    flex: none;
    min-height: 44px;
    margin-left: auto;
    padding: 0 4px;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    font-size: 1rem;
    line-height: 44px;
    text-decoration: none;
}

.viewer-code {
    max-width: none;
    margin: 0 calc(-1 * var(--side));
    overflow-x: auto;
    overscroll-behavior-x: contain;
    -webkit-overflow-scrolling: touch;
}

.viewer-lines {
    width: max-content;
    min-width: 100%;
    max-width: none;
    margin: 0;
    padding: 0 var(--side) 0 0;
    color: var(--text);
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 0.735rem;
    line-height: 1.55;
    list-style: none;
}

.viewer-lines li {
    display: flex;
    max-width: none;
}

.viewer-n {
    position: sticky;
    left: 0;
    flex: none;
    width: calc(var(--side) + var(--digits, 3) * 1ch + 1ch);
    padding-right: 1ch;
    background: var(--bg);
    color: var(--text-4);
    text-align: right;
    user-select: none;
}

.viewer-text {
    max-width: none;
    padding-left: 1ch;
    font: inherit;
    white-space: pre;
    word-break: normal;
    overflow-wrap: normal;
}

.viewer-lines li.here,
.viewer-lines li.here .viewer-n {
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
