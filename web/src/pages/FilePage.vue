<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {projectFile} from "../api.js";
import {highlight, languageOf} from "../text/highlight.js";
import Icon from "../kit/Icon.vue";
import {route} from "../route.js";

const file = ref(null);
const error = ref("");
const lines = computed(() => (file.value ? highlight(file.value.text, languageOf(file.value.path)) : []));

async function load() {
    error.value = "";
    file.value = null;
    try {
        file.value = await projectFile(route.value.env, route.value.q);
    } catch (e) {
        error.value = e.message;
    }
}
onMounted(load);
watch(() => route.value.q, load);
</script>

<template>
    <section class="filepage">
        <template v-if="error">
            <p class="empty">{{ error }}</p>
        </template>
        <template v-if="file">
            <header class="head">
                <Icon name="file" />
                <code class="path">{{ file.path }}</code>
                <span class="when">{{ file.lines ? `${file.lines} lines · ` : "" }}{{ file.size }} bytes</span>
            </header>
            <template v-if="file.kind.startsWith('image/')">
                <p class="empty">An image; open it from Files if it is an attachment.</p>
            </template>
            <template v-else>
                <pre class="text"><template v-for="(line, i) in lines" :key="i"><span class="n">{{ i + 1 }}</span><span v-html="line" />
</template></pre>
            </template>
        </template>
    </section>
</template>

<style scoped>
.filepage {
    max-width: 1080px;
    padding: 22px 28px 60px;
}

.empty {
    color: var(--text-3);
}

.head {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--border);
}

.head .ico {
    width: 15px;
    height: 15px;
    color: var(--text-3);
}

.path {
    padding: 1px 6px;
    border-radius: 4px;
    background: var(--raised);
    font-size: 12.5px;
    color: var(--accent-text);
}

.when {
    font-size: 12px;
    color: var(--text-3);
}

.text {
    margin: 14px 0 0;
    padding: 12px 14px;
    overflow-x: auto;
    border: 1px solid var(--border);
    border-radius: 9px;
    background: #121316;
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 11.5px;
    line-height: 1.5;
    color: var(--text-2);
}

.text :deep(.tok-comment) {
    color: var(--text-4);
    font-style: italic;
}

.text :deep(.tok-string) {
    color: #a8d08d;
}

.text :deep(.tok-number) {
    color: #e0b26a;
}

.text :deep(.tok-keyword) {
    color: var(--accent-text);
}

.text :deep(.tok-type) {
    color: #7fc6d9;
}

.text :deep(.tok-property) {
    color: #c8a8e8;
}

.n {
    display: inline-block;
    width: 3.5em;
    margin-right: 10px;
    text-align: right;
    color: var(--text-4);
    user-select: none;
}
</style>
