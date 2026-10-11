<script setup>
import EmptyState from "../kit/EmptyState.vue";
import FilePage from "./FilePage.vue";
import ProjectTree from "../resource/ProjectTree.vue";
import SectionHeading from "../kit/SectionHeading.vue";
import {computed, ref} from "vue";
import {href, route} from "../route.js";

const picked = ref(null);
const path = computed(() => route.value.q || "");
const folder = computed(() => path.value.split("/").slice(0, -1).join("/") || "the project root");
const bytes = computed(() => (picked.value && picked.value.path === path.value ? picked.value.size : null));

function open(entry) {
    picked.value = entry;
    window.location.hash = href.page(route.value.env, "code", 0, entry.path).slice(1);
}
</script>

<template>
    <section class="code">
        <aside class="code-tree">
            <SectionHeading>Files</SectionHeading>
            <ProjectTree :open="path" @pick="open" />
        </aside>
        <div class="code-open">
            <template v-if="path">
                <FilePage />
            </template>
            <template v-else>
                <EmptyState>Choose a file on the left to read it.</EmptyState>
            </template>
        </div>
        <aside class="code-about">
            <SectionHeading>About this file</SectionHeading>
            <template v-if="path">
                <dl class="code-facts">
                    <dt>Name</dt>
                    <dd>{{ path.split("/").pop() }}</dd>
                    <dt>Folder</dt>
                    <dd>{{ folder }}</dd>
                    <template v-if="bytes !== null">
                        <dt>Size</dt>
                        <dd>{{ bytes }} bytes</dd>
                    </template>
                </dl>
                <a class="code-elsewhere" :href="href.file(route.env, path)">Open this file on its own page</a>
            </template>
            <template v-else>
                <p class="code-none">No file is open.</p>
            </template>
        </aside>
    </section>
</template>

<style scoped>
.code {
    display: grid;
    grid-template-columns: minmax(180px, 240px) minmax(0, 1fr) minmax(180px, 240px);
    gap: 16px;
    align-items: start;
    height: 100%;
}

.code-tree,
.code-about {
    position: sticky;
    top: 0;
    max-height: 100vh;
    overflow-y: auto;
}

.code-open {
    min-width: 0;
}

.code-facts {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 4px 10px;
    margin: 0;
    font-size: 12.5px;
}

.code-facts dt {
    color: var(--muted, #888);
}

.code-facts dd {
    margin: 0;
    overflow-wrap: anywhere;
}

.code-elsewhere {
    display: inline-block;
    margin-top: 12px;
    font-size: 12.5px;
}

.code-none {
    margin: 0;
    color: var(--muted, #888);
    font-size: 12.5px;
}

@media (max-width: 900px) {
    .code {
        grid-template-columns: minmax(0, 1fr);
    }

    .code-tree,
    .code-about {
        position: static;
        max-height: none;
    }
}
</style>
