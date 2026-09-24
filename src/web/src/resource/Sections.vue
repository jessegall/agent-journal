<script setup>
import {computed} from "vue";
import TextDisplay from "../kit/TextDisplay.vue";

const props = defineProps({sections: Array, document: Boolean});
const CONTENTS_FROM = 3;
const listed = computed(() => props.document && props.sections.length >= CONTENTS_FROM);
const numbered = computed(() => !props.sections.some((s) => /^\d/.test(s.title)));
const parts = [];
const jump = (i) => parts[i]?.scrollIntoView({block: "start", behavior: "smooth"});
</script>

<template>
    <template v-if="listed">
        <nav class="contents" aria-label="Contents">
            <span class="contents-head">Contents</span>
            <ol>
                <template v-for="(s, i) in sections" :key="s.title">
                    <li>
                        <button type="button" @click="jump(i)">
                            <template v-if="numbered">
                                <span class="contents-n">{{ i + 1 }}</span>
                            </template>
                            {{ s.title }}
                        </button>
                    </li>
                </template>
            </ol>
        </nav>
    </template>
    <template v-for="(s, i) in sections" :key="s.title">
        <section :ref="(el) => (parts[i] = el)" :class="['section', {reading: document}]">
            <h3>{{ s.title }}</h3>
            <TextDisplay :text="s.body" />
        </section>
    </template>
</template>

<style scoped>
.section {
    margin-top: 16px;
}

h3 {
    margin: 0 0 4px;
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
}

.section.reading {
    margin-top: 28px;
    scroll-margin-top: 120px;
}

.section.reading h3 {
    margin-bottom: 8px;
    font-size: 15px;
    letter-spacing: -0.005em;
}

.contents {
    margin: 22px 0 6px;
    padding: 12px 16px 12px 14px;
    border-left: 2px solid var(--border-2);
}

.contents-head {
    display: block;
    margin-bottom: 6px;
    color: var(--text-3);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
}

ol {
    columns: 2 220px;
    column-gap: 28px;
    margin: 0;
    padding: 0;
    list-style: none;
}

li {
    break-inside: avoid;
}

li button {
    display: flex;
    gap: 10px;
    width: 100%;
    padding: 3px 0;
    border: 0;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12.5px;
    line-height: 1.4;
    text-align: left;
    cursor: pointer;
}

li button:hover {
    color: var(--accent-text);
}

.contents-n {
    flex: none;
    width: 1.4em;
    color: var(--text-4);
    font-variant-numeric: tabular-nums;
    text-align: right;
}
</style>
