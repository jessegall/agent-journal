<script setup>
import CloseButton from "../kit/CloseButton.vue";
import Icon from "../kit/Icon.vue";
import Skeleton from "../kit/Skeleton.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import CommentToggle from "./CommentToggle.vue";
import ResourceBody from "./ResourceBody.vue";
import RevisionStrip from "./RevisionStrip.vue";
import RevisionPart from "./RevisionPart.vue";
import {useDocRevisions} from "../composables/docRevisions.js";

const props = defineProps({resource: {type: Object, required: true}, readOnly: Boolean});
const emit = defineEmits(["close"]);
const revisions = useDocRevisions(() => props.resource);
</script>

<template>
    <template v-if="revisions.latest && !revisions.comparing">
        <ResourceBody :resource="resource" :comments="false" :links="false" :read-only="readOnly" @close="emit('close')">
            <template #head>
                <template v-if="revisions.count > 1 || revisions.open">
                    <RevisionStrip :revisions="revisions" />
                </template>
            </template>
        </ResourceBody>
    </template>
    <template v-else>
        <article class="doc-revision">
            <header class="top">
                <span class="kind">
                    <Icon name="revisions" :size="13" />
                    Document {{ resource.id }}, revision {{ revisions.at + 1 }}
                </span>
                <span class="grow" />
                <template v-if="!readOnly">
                    <CommentToggle :resource="resource" />
                    <CloseButton @click="emit('close')" />
                </template>
            </header>
            <RevisionStrip :revisions="revisions" />
            <template v-if="revisions.page">
                <h2 :class="['title', {changed: revisions.topChanged.title}]">{{ revisions.page.title }}</h2>
                <template v-if="revisions.page.abstract">
                    <TextDisplay :class="['abstract', {changed: revisions.topChanged.abstract}]" :text="revisions.page.abstract" />
                </template>
                <template v-if="revisions.intro(revisions.page.body)">
                    <TextDisplay
                        :class="['abstract', {changed: revisions.topChanged.intro}]"
                        :text="revisions.intro(revisions.page.body)"
                    />
                </template>
                <template v-for="part in revisions.parts" :key="part.title">
                    <RevisionPart :part="part" />
                </template>
            </template>
            <template v-else>
                <Skeleton shape="text" label="Loading the revision" />
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
    letter-spacing: 0.04em;
    text-transform: uppercase;
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

.abstract {
    margin: 0 0 10px;
    color: var(--text-2);
}

.changed {
    padding-left: 8px;
    border-left: 2px solid var(--progress);
}
</style>
