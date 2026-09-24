<script setup>
import {sharedData} from "../api/shared.js";
import {computed, onMounted, ref, watch} from "vue";
import Icon from "../kit/Icon.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import Chapters from "../resource/Chapters.vue";
import Sections from "../resource/Sections.vue";
import {route} from "../route.js";
import {store} from "../state/store.js";

const KINDS = {
    doc: {title: "Document", icon: "docs"},
    collection: {title: "Collection", icon: "folder"},
    report: {title: "Report", icon: "reports"},
};
const data = ref(null);
const failed = ref(false);
const page = ref(null);
const scroller = ref(null);

function stock(rows) {
    store.spec = {
        priority: Object.keys(KINDS),
        types: Object.fromEntries(Object.entries(KINDS).map(([name, kind]) => [name, {title: kind.title, labels: {}, command_names: {}}])),
    };
    const grouped = {};
    for (const [ref, row] of Object.entries(rows)) {
        const [type, n] = ref.split(":");
        (grouped[type] ||= []).push({...row, type, n: Number(n), refs: [], seen: [], data: {}});
    }
    store.rows = grouped;
}

onMounted(async () => {
    try {
        const read = await sharedData();
        stock(read.rows || {});
        data.value = read;
    } catch (e) {
        failed.value = true;
    }
});

const shownRef = computed(() => {
    const open = route.value.open;
    const asked = open ? `${open.type}:${open.n}` : "";
    return data.value?.rows[asked] ? asked : data.value?.share.target;
});
const item = computed(() => data.value?.rows[shownRef.value] || null);
const kind = computed(() => KINDS[shownRef.value?.split(":")[0]] || {title: "Item", icon: "docs"});
const number = computed(() => shownRef.value?.split(":")[1] || "");
const away = computed(() => shownRef.value !== data.value?.share.target);
const home = computed(() => data.value?.rows[data.value.share.target]);
const sections = computed(() => item.value?.sections || []);
const members = computed(() => (item.value?.members || []).map((ref) => ({ref, row: data.value.rows[ref]})).filter((m) => m.row));
const pictures = computed(() => Object.keys(item.value?.pictures || {}));
const others = computed(() => (item.value?.files || []).filter((name) => !pictures.value.includes(name)));
const fileUrl = (name) => `./files/${shownRef.value.replace(":", "/")}/${encodeURIComponent(name)}`;
const size = (name) => item.value.pictures[name] || [];
const ends = computed(() => {
    const at = data.value?.share.expires;
    if (!at) return "View only";
    const day = new Date(at * 1000).toLocaleDateString(undefined, {day: "numeric", month: "long", year: "numeric"});
    return `View only · this link ends ${day}`;
});
const firstLine = (row) => row.abstract || String(row.brief || "").split("\n")[0];

watch(item, (shown) => {
    if (shown) document.title = shown.title;
    scroller.value?.scrollTo({top: 0});
});
</script>

<template>
    <div ref="scroller" class="share-scroll">
        <template v-if="failed">
            <main class="share-page gone">
                <Icon name="lock" :size="18" />
                <h1>This link doesn't open anything</h1>
                <p>It may have ended, or the address is not complete.</p>
            </main>
        </template>
        <template v-else-if="item">
            <main :key="shownRef" ref="page" class="share-page body">
                <header class="head">
                    <div class="top">
                        <template v-if="away && home">
                            <a class="back" href="#">
                                <Icon name="back" :size="12" />
                                {{ home.title }}
                            </a>
                        </template>
                        <template v-else>
                            <span class="kind">
                                <Icon :name="kind.icon" :size="13" />
                                {{ kind.title }} {{ number }}
                            </span>
                        </template>
                        <span class="view-only">
                            <Icon name="lock" :size="11" />
                            {{ ends }}
                        </span>
                    </div>
                    <h1 class="title">{{ item.title }}</h1>
                    <template v-if="sections.length >= 2">
                        <Chapters :sections="sections" :body="page" />
                    </template>
                </header>
                <template v-if="item.abstract">
                    <TextDisplay class="abstract" :text="item.abstract" />
                </template>
                <template v-if="item.brief">
                    <TextDisplay class="brief" :text="item.brief" />
                </template>
                <template v-if="sections.length">
                    <Sections :sections="sections" document />
                </template>
                <template v-if="members.length">
                    <section class="members">
                        <template v-for="m in members" :key="m.ref">
                            <a class="row-card" :href="`#?open=${m.ref}`">
                                <span class="row-card-kind">{{ (KINDS[m.ref.split(":")[0]] || {}).title }} {{ m.ref.split(":")[1] }}</span>
                                <span class="row-card-title">{{ m.row.title }}</span>
                                <template v-if="firstLine(m.row)">
                                    <span class="row-card-line">{{ firstLine(m.row).slice(0, 160) }}</span>
                                </template>
                            </a>
                        </template>
                    </section>
                </template>
                <template v-if="pictures.length || others.length">
                    <section class="files">
                        <h2 class="files-head">Attached</h2>
                        <template v-for="name in pictures" :key="name">
                            <figure class="picture">
                                <a :href="fileUrl(name)" target="_blank" rel="noopener">
                                    <img :src="fileUrl(name)" :alt="name" :width="size(name)[0]" :height="size(name)[1]" loading="lazy" />
                                </a>
                                <figcaption>{{ name }}</figcaption>
                            </figure>
                        </template>
                        <template v-for="name in others" :key="name">
                            <a class="file" :href="fileUrl(name)" download>
                                <Icon name="clip" :size="13" />
                                <span class="file-name">{{ name }}</span>
                                <Icon name="download" :size="12" />
                            </a>
                        </template>
                    </section>
                </template>
                <footer class="foot">Shared from an agent journal. Only what was shared can be seen here.</footer>
            </main>
        </template>
        <template v-else>
            <main class="share-page loading">
                <span class="loading-bar" />
                <span class="loading-bar short" />
            </main>
        </template>
    </div>
</template>

<style scoped>
.share-scroll {
    height: 100%;
    overflow-y: auto;
    overscroll-behavior: contain;
    background: var(--bg);
}

.share-page {
    display: flex;
    flex-direction: column;
    max-width: 760px;
    min-height: 100%;
    margin: 0 auto;
    padding: 0 18px 28px;
    overflow-wrap: anywhere;
}

.head {
    position: sticky;
    top: 0;
    z-index: 2;
    margin: 0 -18px;
    padding: 14px 18px 12px;
    border-bottom: 1px solid var(--border);
    background: var(--bg);
}

.top {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 10px;
    min-width: 0;
    color: var(--text-3);
    font-size: 11.5px;
}

.kind {
    display: inline-flex;
    flex: none;
    align-items: center;
    gap: 6px;
    color: var(--accent-text);
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.back {
    display: inline-flex;
    max-width: 100%;
    min-width: 0;
    align-items: center;
    gap: 6px;
    overflow: hidden;
    color: var(--text-2);
    text-overflow: ellipsis;
    white-space: nowrap;
}

.back:hover {
    color: var(--text);
}

.view-only {
    display: inline-flex;
    flex: none;
    align-items: center;
    gap: 5px;
    margin-left: auto;
    color: var(--text-3);
}

.title {
    margin: 8px 0 0;
    color: var(--text);
    font-size: 21px;
    font-weight: 600;
    line-height: 1.3;
    letter-spacing: -0.01em;
}

.abstract {
    margin-top: 18px;
    color: var(--text-2);
    font-size: 15px;
}

.brief {
    margin-top: 14px;
}

.members {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 10px;
    margin-top: 22px;
}

.members .row-card {
    margin: 0;
}

.files {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 32px;
}

.files-head {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.picture {
    margin: 0;
}

.picture img {
    display: block;
    max-width: 100%;
    height: auto;
    border: 1px solid var(--border);
    border-radius: 8px;
}

.picture figcaption {
    margin-top: 6px;
    color: var(--text-3);
    font-size: 12px;
}

.file {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 9px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text);
}

.file:hover {
    border-color: var(--border-2);
    background: var(--hover);
}

.file-name {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.foot {
    margin-top: auto;
    padding-top: 40px;
    color: var(--text-4);
    font-size: 12px;
    text-align: center;
}

.gone {
    align-items: center;
    justify-content: center;
    gap: 6px;
    color: var(--text-3);
    text-align: center;
}

.gone h1 {
    margin: 6px 0 0;
    color: var(--text);
    font-size: 17px;
    font-weight: 600;
}

.gone p {
    margin: 0;
}

.loading {
    gap: 12px;
    padding-top: 60px;
}

.loading-bar {
    display: block;
    width: 70%;
    height: 14px;
    border-radius: 7px;
    background: var(--border);
}

.loading-bar.short {
    width: 40%;
}

@media (min-width: 720px) {
    .share-page {
        padding: 0 32px 36px;
    }

    .head {
        margin: 0 -32px;
        padding: 20px 32px 14px;
    }

    .title {
        font-size: 24px;
    }
}
</style>
