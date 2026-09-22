<script setup>
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import CommentToggle from "./CommentToggle.vue";
import Markdown from "./Markdown.vue";
import ResourceBody from "./ResourceBody.vue";
import RevisionStrip from "./RevisionStrip.vue";
import {useRevisions} from "../composables/revisions.js";

const props = defineProps({resource: Object});
const emit = defineEmits(["close"]);
const revisions = useRevisions(() => props.resource);
</script>

<template>
    <template v-if="revisions.latest && !revisions.comparing">
        <ResourceBody :resource="resource" :comments="false" @close="emit('close')">
            <template #head>
                <RevisionStrip :revisions="revisions" />
            </template>
        </ResourceBody>
    </template>
    <template v-else>
        <article class="body">
            <header class="top">
                <span class="kind">
                    <Icon name="revisions" :size="13" />
                    Doc {{ resource.n }}, revision {{ revisions.at + 1 }}
                </span>
                <span class="grow" />
                <CommentToggle />
                <Btn kind="icon" @click="emit('close')"><Icon name="x" /></Btn>
            </header>
            <RevisionStrip :revisions="revisions" />
            <template v-if="!revisions.page">
                <div class="skeleton">
                    <span class="blank wide" />
                    <span class="blank" />
                    <span class="blank half" />
                </div>
            </template>
            <template v-else>
                <h2 :class="['title', {changed: revisions.topChanged.title}]">{{ revisions.page.title }}</h2>
                <template v-if="revisions.page.abstract">
                    <Markdown :class="['abstract', {changed: revisions.topChanged.abstract}]" :text="revisions.page.abstract" />
                </template>
                <template v-if="revisions.page.brief">
                    <Markdown :class="['brief', {changed: revisions.topChanged.brief}]" :text="revisions.page.brief" />
                </template>
                <template v-for="part in revisions.parts" :key="part.title">
                    <section :class="['part', part.kind]">
                        <header class="part-head">
                            <h3>{{ part.title }}</h3>
                            <template v-if="part.kind !== 'same'">
                                <span class="badge">{{ part.kind }}</span>
                            </template>
                        </header>
                        <template v-if="part.kind === 'changed'">
                            <div class="diff">
                                <template v-for="(line, i) in part.lines" :key="i">
                                    <Markdown :class="['line', line.kind]" :text="line.text || ' '" />
                                </template>
                            </div>
                        </template>
                        <template v-else>
                            <Markdown :text="part.body" />
                        </template>
                    </section>
                </template>
            </template>
        </article>
    </template>
</template>

<style scoped>
.top {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--text-3);
    font-size: 11.5px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.kind {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--accent-text);
}

.grow {
    flex: 1;
}

.title {
    margin: 12px 0 4px;
    font-size: 22px;
    font-weight: 600;
}

.abstract,
.brief {
    margin: 0 0 10px;
    color: var(--text-2);
}

.changed {
    border-left: 2px solid var(--progress);
    padding-left: 8px;
}

.part {
    margin-top: 14px;
    padding-left: 10px;
    border-left: 2px solid transparent;
}

.part.added {
    border-left-color: var(--progress);
}

.part.changed {
    border-left-color: var(--accent);
}

.part.removed {
    border-left-color: var(--danger);
    opacity: 0.6;
}

.part.removed h3 {
    text-decoration: line-through;
}

.part-head {
    display: flex;
    align-items: center;
    gap: 8px;
}

.part-head h3 {
    margin: 0 0 4px;
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
}

.badge {
    font-size: 10.5px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-3);
}

.diff {
    margin: 4px 0 0;
    font-size: 13px;
    line-height: 1.55;
}

.line {
    min-height: 1.55em;
    padding: 0 6px;
    border-radius: 3px;
    color: var(--text-2);
}

.line :deep(p),
.line :deep(ul),
.line :deep(ol) {
    margin: 0;
}

.line.added {
    background: color-mix(in srgb, var(--progress) 16%, transparent);
    color: var(--text);
}

.line.removed {
    background: color-mix(in srgb, var(--danger) 14%, transparent);
    color: var(--text-3);
    text-decoration: line-through;
}

.skeleton {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 16px;
}

.blank {
    display: block;
    height: 12px;
    border-radius: 4px;
    background: var(--border);
}

.blank.wide {
    height: 20px;
    width: 60%;
}

.blank.half {
    width: 40%;
}
</style>
