<script setup>
import EmptyState from "../kit/EmptyState.vue";
import FilePage from "./FilePage.vue";
import ProjectTree from "../resource/ProjectTree.vue";
import SectionHeading from "../kit/SectionHeading.vue";
import {computed} from "vue";
import {href, route} from "../route.js";

const path = computed(() => route.value.q || "");
const folder = computed(() => path.value.split("/").slice(0, -1).join("/") || "the project root");

const open = (entry) => (window.location.hash = href.page("code", 0, entry.path).slice(1));
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
                </dl>
                <a class="code-elsewhere" :href="href.file(path)">Open this file on its own page</a>
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
    grid-template-columns: 200px minmax(0, 1fr);
    grid-template-areas:
        "tree open"
        "about open";
    grid-template-rows: auto 1fr;
    gap: 8px 20px;
    align-content: start;
}

.code-tree {
    grid-area: tree;
    max-height: 60vh;
    overflow-y: auto;
}

.code-about {
    grid-area: about;
}

.code-open {
    grid-area: open;
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

@media (min-width: 1400px) {
    .code {
        grid-template-columns: 200px minmax(0, 1fr) 220px;
        grid-template-areas: "tree open about";
    }

    .code-tree {
        position: sticky;
        top: 0;
        max-height: 100vh;
    }

    .code-about {
        position: sticky;
        top: 0;
    }
}

@media (max-width: 760px) {
    .code {
        grid-template-columns: minmax(0, 1fr);
        grid-template-areas:
            "tree"
            "about"
            "open";
    }
}
</style>
