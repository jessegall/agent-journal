<script setup>
import {computed} from "vue";
import CloseButton from "../kit/CloseButton.vue";
import Icon from "../kit/Icon.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import Chapters from "./Chapters.vue";
import DownloadLink from "./DownloadLink.vue";
import {isUpdate, updateLabel} from "../domain/updates.js";
import {age} from "../format/time.js";
import {peek} from "../route.js";

const props = defineProps({
    resource: {type: Object, required: true},
    kind: {type: Object, required: true},
    state: {type: Object, default: null},
    writing: {type: Object, default: null},
    readOnly: {type: Boolean, default: false},
    editing: {type: Boolean, default: false},
    body: {default: null},
});
const title = defineModel("title", {type: String, default: ""});
const emit = defineEmits(["close", "follow", "cancel"]);
const data = computed(() => props.resource.data || {});
const template = computed(() => data.value.template || "");
const chaptered = computed(
    () => props.kind.view === "document" && !["message", "sequence"].includes(props.resource.type) && props.resource.sections.length >= 2
);
</script>

<template>
    <header class="head">
        <div class="top">
            <span class="kind">
                <Icon :name="kind.icon" :size="13" />
                {{ isUpdate(resource) ? updateLabel(resource) : `${kind.title} ${resource.n}` }}
            </span>
            <template v-if="state && !readOnly">
                <SwitchCase :value="state.key">
                    <template #replaced>
                        <button type="button" class="standing replaced" :title="state.hint" @click="peek('doc', state.by)">
                            {{ state.label }}
                            <Icon name="arrow" :size="10" />
                        </button>
                    </template>
                    <template #default>
                        <span :class="['standing', state.key]" :title="state.hint">
                            <template v-if="state.key === 'final'">
                                <Icon name="check" :size="10" />
                            </template>
                            {{ state.label }}
                        </span>
                    </template>
                </SwitchCase>
            </template>
            <template v-if="data.system">
                <span class="standing system" title="Ships with the journal; it can be read but not changed">
                    <Icon name="lock" :size="10" />
                    System
                </span>
            </template>
            <template v-if="writing && kind.view === 'document' && !readOnly">
                <button type="button" class="writing-now" title="Go to what the agent is writing" @click="emit('follow')">
                    <span class="writing-dot" />
                    Agent writing
                    <template v-if="writing.section">
                        <span class="writing-where">{{ writing.section }}</span>
                    </template>
                </button>
            </template>
            <span class="age">{{ age(resource.created) }}</span>
            <slot name="tools" />
            <template v-if="!readOnly">
                <template v-if="kind.view === 'document'">
                    <DownloadLink :resource="resource" />
                </template>
                <CloseButton @click="emit('close')" />
            </template>
        </div>
        <template v-if="data.template && !readOnly">
            <button type="button" class="from" @click="peek('template', Number(template))">
                <Icon name="docs" :size="11" />
                Made from template {{ template }}
            </button>
        </template>
        <template v-if="editing">
            <input
                v-model="title"
                class="edit-title"
                maxlength="80"
                placeholder="Title, at most 80 characters"
                @keydown.esc="emit('cancel')"
            />
        </template>
        <template v-else>
            <h2 class="title">{{ resource.title }}</h2>
            <template v-if="chaptered">
                <Chapters :sections="resource.sections" :body="body" />
            </template>
        </template>
    </header>
</template>

<style scoped>
.from {
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
    gap: 5px;
    margin-top: 6px;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-3);
    font-size: 12px;
    cursor: pointer;
}

.from:hover {
    color: var(--text);
}

.head {
    position: sticky;
    top: 0;
    z-index: 2;
    margin: -16px -16px 0;
    padding: 16px 16px 8px;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
}

.top {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--text-3);
    font-size: 11.5px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.kind {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
    color: var(--accent-text);
}

.age {
    flex: 1 0 auto;
    white-space: nowrap;
}

.writing-now {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    max-width: 280px;
    padding: 0 8px 0 7px;
    border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
    border-radius: 99px;
    background: color-mix(in srgb, var(--accent) 12%, transparent);
    color: var(--accent-text);
    font: inherit;
    font-size: 10.5px;
    line-height: 17px;
    letter-spacing: 0;
    text-transform: none;
    white-space: nowrap;
    cursor: pointer;
}

.writing-now:hover {
    background: color-mix(in srgb, var(--accent) 22%, transparent);
}

.writing-dot {
    flex: none;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent-text);
    animation: writing-pulse 1.4s ease-in-out infinite;
}

.writing-where {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--text-2);
}

.writing-where::before {
    content: "· ";
}

.standing {
    flex: none;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 0 7px;
    border: 1px solid var(--border-2);
    border-radius: 99px;
    color: var(--text-2);
    font: inherit;
    font-size: 10.5px;
    line-height: 17px;
    letter-spacing: 0;
    text-transform: none;
    background: none;
}

.standing.draft {
    border-style: dashed;
    color: var(--text-3);
}

.standing.replaced {
    cursor: pointer;
}

.standing.replaced:hover {
    border-color: var(--accent);
    color: var(--accent-text);
}

.title {
    margin: 10px 0 0;
    font-size: 19px;
    font-weight: 600;
    line-height: 1.3;
}

.edit-title {
    width: 100%;
    margin: 10px 0 0;
    padding: 6px 10px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: var(--raised);
    font-size: 17px;
    font-weight: 600;
}

@keyframes writing-pulse {
    50% {
        opacity: 0.35;
        transform: scale(0.7);
    }
}
</style>
