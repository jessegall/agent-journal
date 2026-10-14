<script setup>
import {useRevisions} from "../composables/revisions.js";
import Icon from "../kit/Icon.vue";
import TextDisplay from "../kit/TextDisplay.vue";

const props = defineProps({row: {type: Object, required: true}});
const versions = useRevisions(() => props.row);
</script>

<template>
    <template v-if="versions.count > 1">
        <section class="versions" aria-label="Versions">
            <div class="versions-strip">
                <button type="button" class="versions-step" aria-label="Earlier version" :disabled="versions.at === 0" @click="versions.go(versions.at - 1)">
                    <Icon name="back" :size="16" />
                </button>
                <span class="versions-at">Version {{ versions.at + 1 }} of {{ versions.count }}{{ versions.latest ? " · latest" : "" }}</span>
                <button type="button" class="versions-step" aria-label="Later version" :disabled="versions.latest" @click="versions.go(versions.at + 1)">
                    <Icon name="chevronRight" :size="16" />
                </button>
            </div>
            <template v-if="versions.note">
                <p class="versions-note">{{ versions.note }}</p>
            </template>
            <template v-if="versions.status">
                <button type="button" class="versions-keep" @click="versions.keep()">Keep this version</button>
            </template>
            <template v-if="!versions.latest && versions.page">
                <div class="versions-old">
                    <h2 class="versions-title">{{ versions.page.title }}</h2>
                    <template v-if="versions.page.brief">
                        <TextDisplay :text="versions.page.brief" />
                    </template>
                    <template v-for="part in versions.parts" :key="part.title">
                        <h3 class="versions-part">{{ part.title }}</h3>
                        <TextDisplay :text="part.body" />
                    </template>
                </div>
            </template>
            <template v-if="versions.error">
                <p class="versions-note">{{ versions.error }}</p>
            </template>
        </section>
    </template>
</template>

<style scoped>
.versions {
    margin: 4px 0 14px;
}

.versions-strip {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 12px;
    background: var(--sel);
}

.versions-step {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border: 0;
    background: none;
    color: var(--accent);
}

.versions-step:disabled {
    color: var(--text-3);
}

.versions-at {
    font-size: 0.875rem;
    font-weight: 600;
}

.versions-note {
    margin: 6px 4px 0;
    color: var(--text-3);
    font-size: 0.8125rem;
}

.versions-keep {
    min-height: 44px;
    padding: 0 4px;
    border: 0;
    background: none;
    color: var(--accent);
    font: inherit;
}

.versions-old {
    margin-top: 10px;
    padding: 10px 12px;
    border: 1px solid var(--line);
    border-radius: 12px;
}

.versions-title {
    margin: 0 0 6px;
    font-size: 1.1em;
}

.versions-part {
    margin: 14px 0 4px;
    font-size: 1em;
}
</style>
