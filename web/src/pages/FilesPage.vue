<script setup>
import {computed, onMounted, ref} from "vue";
import {api} from "../api.js";
import Icon from "../kit/Icon.vue";
import {peek, route} from "../route.js";
import {age, meta, openPictures} from "../store.js";

const files = ref([]);
const loaded = ref(false);
onMounted(async () => {
    files.value = await api("GET", `/${route.value.env}/files`);
    loaded.value = true;
});
const images = computed(() => files.value.filter((f) => f.image));
const others = computed(() => files.value.filter((f) => !f.image));
const source = (f) => `${meta(f.type).title} ${f.n}`;
const size = (n) => (n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(0)} KB` : `${(n / 1048576).toFixed(1)} MB`);
const pictures = computed(() => images.value.map((f) => ({url: f.url, name: f.name})));
</script>

<template>
    <section class="files">
        <div class="bar">
            <span class="count">{{ files.length }} files on {{ route.env }}</span>
        </div>
        <template v-if="loaded && !files.length">
            <p class="empty">No files are stored on this environment yet. Files attached to a message or added to a document show here.</p>
        </template>
        <template v-if="images.length">
            <h3 class="label">
                Images
                <span class="muted">{{ images.length }}</span>
            </h3>
            <div class="gallery">
                <template v-for="(f, i) in images" :key="f.url">
                    <figure class="tile">
                        <a class="tile-img" :href="f.url" :title="`Open ${f.name}`" @click.prevent="openPictures(pictures, i)">
                            <img :src="f.url" :alt="f.name" loading="lazy" />
                        </a>
                        <figcaption>
                            <span class="tile-name" :title="f.name">{{ f.name }}</span>
                            <button type="button" class="tile-source" @click="peek(f.type, f.n)">{{ source(f) }}</button>
                        </figcaption>
                    </figure>
                </template>
            </div>
        </template>
        <template v-if="others.length">
            <h3 class="label">
                Other files
                <span class="muted">{{ others.length }}</span>
            </h3>
            <div class="rows">
                <template v-for="f in others" :key="f.url">
                    <div class="row">
                        <a class="thumb" :href="f.url" target="_blank" :title="`Open ${f.name}`"><Icon name="docs" /></a>
                        <div class="main">
                            <a class="name" :href="f.url" target="_blank">{{ f.name }}</a>
                            <span class="meta">
                                <button type="button" class="source" @click="peek(f.type, f.n)">{{ source(f) }}</button>
                                <span>· {{ size(f.size) }}</span>
                            </span>
                        </div>
                        <span class="age">{{ age(f.at) }}</span>
                    </div>
                </template>
            </div>
        </template>
    </section>
</template>

<style scoped>
.files {
    padding: 0 0 40px;
}

.bar {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 44px;
    padding: 0 14px 0 22px;
    border-bottom: 1px solid var(--border);
    color: var(--text-2);
}

.empty {
    padding: 24px 22px;
    color: var(--text-3);
}

.label {
    margin: 22px 22px 10px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-3);
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.muted {
    margin-left: 4px;
    font-weight: 400;
}

.gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
    padding: 0 22px;
}

.tile {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
    margin: 0;
}

.tile-img {
    display: block;
    aspect-ratio: 1;
    max-width: 100%;
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--raised);
}

.tile-img:hover {
    border-color: var(--border-2);
}

.tile-img img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

figcaption {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
    font-size: 12px;
}

.tile-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--text-2);
}

.tile-source,
.source {
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-3);
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.tile-source:hover,
.source:hover {
    color: var(--accent-text);
}

.rows {
    display: flex;
    flex-direction: column;
}

.row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 22px;
    border-bottom: 1px solid var(--border);
}

.thumb {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border: 1px solid var(--border);
    border-radius: 7px;
    background: var(--raised);
    color: var(--text-3);
}

.main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
}

.name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--text);
}

.meta {
    color: var(--text-3);
    font-size: 12px;
}

.age {
    flex: none;
    color: var(--text-3);
    font-size: 12px;
}
</style>
