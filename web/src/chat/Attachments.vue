<script setup>
import {computed} from "vue";
import Icon from "../kit/Icon.vue";
import {api} from "../api/client.js";
import {route} from "../route.js";
import {openPictures} from "../store.js";

const props = defineProps({resource: Object});
const emit = defineEmits(["grew"]);
const picture = (name) => /\.(png|jpe?g|gif|webp)$/i.test(name);
const video = (name) => /\.(mp4|m4v|mov|webm|ogv)$/i.test(name);
const url = (name) => (props.resource.data.previews || {})[name] || api.fileUrl(props.resource.type, props.resource.n, name);
const files = computed(() => props.resource.data.files || {});
const sized = (name) => {
    const [w, h] = (props.resource.data.pictures || {})[name] || [];
    return w && h ? {width: w, height: h, style: {aspectRatio: `${w} / ${h}`, width: `${Math.min(w, Math.round((320 * w) / h))}px`}} : {};
};
const names = computed(() => Object.keys(files.value));
const derived = (name) => String(files.value[name] || "").startsWith("video frame from ");
const pictures = computed(() => names.value.filter((name) => picture(name) && !derived(name)).map((name) => ({name, url: url(name)})));
const videos = computed(() => names.value.filter(video));
const others = computed(() => names.value.filter((name) => !picture(name) && !video(name)));
const grid = computed(() => pictures.value.length > 1);
</script>

<template>
    <div :class="['thread-files', {alone: !resource.brief}]">
        <template v-if="grid">
            <div :class="['thread-grid', {pair: pictures.length === 2, three: pictures.length === 3}]">
                <template v-for="(p, i) in pictures.slice(0, 4)" :key="p.name">
                    <a
                        :class="['thread-shot', {more: i === 3 && pictures.length > 4}]"
                        :href="p.url"
                        :title="p.name"
                        @click.prevent="openPictures(pictures, i)"
                    >
                        <img :src="p.url" :alt="p.name" v-bind="sized(p.name)" @load="emit('grew')" />
                        <template v-if="i === 3 && pictures.length > 4">
                            <span class="thread-shot-more">{{ pictures.length - 4 }} more</span>
                        </template>
                    </a>
                </template>
            </div>
        </template>
        <template v-else>
            <template v-for="(p, i) in pictures" :key="p.name">
                <a class="thread-file" :href="p.url" :title="p.name" @click.prevent="openPictures(pictures, i)">
                    <img class="thread-image" :src="p.url" :alt="p.name" v-bind="sized(p.name)" @load="emit('grew')" />
                </a>
            </template>
        </template>
        <template v-for="name in videos" :key="name">
            <video class="thread-video" controls preload="metadata" @loadedmetadata="emit('grew')">
                <source :src="url(name)" />
                <a :href="url(name)" target="_blank">{{ name }}</a>
            </video>
        </template>
        <template v-for="name in others" :key="name">
            <a class="thread-file" :href="url(name)" target="_blank" :title="name">
                <span class="thread-file-name">
                    <Icon name="paperclip" />
                    {{ name }}
                </span>
            </a>
        </template>
    </div>
</template>

<style scoped>
.thread-files {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 8px;
}

.thread-files.alone {
    margin-top: 0;
}

.thread-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;
}

.thread-grid.three .thread-shot:first-child {
    grid-column: span 2;
}

.thread-shot {
    position: relative;
    display: block;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    border-radius: 7px;
    border: 1px solid var(--border);
}

.thread-shot img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.thread-shot.more img {
    filter: brightness(0.45);
}

.thread-shot-more {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text);
    font-size: 13px;
    font-weight: 500;
}

.thread-image {
    display: block;
    height: auto;
    max-width: 100%;
    max-height: 320px;
    object-fit: contain;
    border-radius: 7px;
    border: 1px solid var(--border);
    background: var(--raised);
}

.thread-video {
    display: block;
    width: 100%;
    max-height: 360px;
    border: 1px solid var(--border);
    border-radius: 7px;
    background: #000;
}

.thread-file-name {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: var(--accent-text);
}

.thread-file-name .ico {
    width: 13px;
    height: 13px;
    color: inherit;
}
</style>
