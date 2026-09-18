<script setup>
import {computed} from "vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import {fileUrl} from "../api.js";
import {route} from "../route.js";
import {age, label, meta, word} from "../store.js";
import ResourceActions from "./ResourceActions.vue";
import Sections from "./Sections.vue";
import OptionsPicker from "./OptionsPicker.vue";
import Priority from "./Priority.vue";
import Comments from "./Comments.vue";
import Links from "./Links.vue";

const props = defineProps({resource: Object, comments: {type: Boolean, default: true}});
const emit = defineEmits(["close"]);
const kind = computed(() => meta(props.resource.type));
const files = computed(() => Object.entries(props.resource.data.files || {}));
const ranked = computed(() => !!kind.value.fields.priority && !props.resource.completed);
</script>

<template>
    <article class="body">
        <header class="head">
            <div class="top">
                <span class="kind">
                    <Icon :name="kind.icon" :size="13" />
                    {{ kind.title }} {{ resource.n }}
                </span>
                <span class="age">{{ age(resource.created) }}</span>
                <Btn kind="icon" @click="emit('close')"><Icon name="x" /></Btn>
            </div>
            <h2 class="title">{{ resource.title }}</h2>
        </header>
        <template v-if="resource.abstract">
            <p class="abstract">{{ resource.abstract }}</p>
        </template>
        <div class="controls">
            <ResourceActions :resource="resource" />
            <template v-if="ranked">
                <Priority :resource="resource" />
            </template>
        </div>
        <template v-if="kind.fields.options">
            <OptionsPicker :resource="resource" />
        </template>
        <template v-if="resource.brief">
            <section class="block">
                <template v-if="kind.labels.brief">
                    <h3>{{ kind.labels.brief }}</h3>
                </template>
                <div class="text">{{ resource.brief }}</div>
            </section>
        </template>
        <Sections :sections="resource.sections" />
        <template v-if="resource.completed">
            <section class="block">
                <h3>
                    {{
                        label(
                            resource.type,
                            "outcome",
                            word(resource.type, "complete").replace(/^\w/, (c) => c.toUpperCase())
                        )
                    }}
                </h3>
                <div class="text">{{ resource.outcome || age(resource.completed) }}</div>
            </section>
        </template>
        <template v-if="files.length">
            <section class="block">
                <h3>Files</h3>
                <template v-for="[name, what] in files" :key="name">
                    <a class="file" :href="fileUrl(route.env, resource.type, resource.n, name)" target="_blank">
                        <Icon name="clip" :size="13" />
                        {{ name }}
                        <template v-if="what">
                            <span class="what">— {{ what }}</span>
                        </template>
                    </a>
                </template>
            </section>
        </template>
        <Links :resource="resource" />
        <footer class="foot">seen by {{ resource.seen.join(", ") || "nobody" }}</footer>
        <template v-if="comments">
            <Comments :resource="resource" />
        </template>
    </article>
</template>

<style scoped>
.body {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    padding: 16px 20px 0;
}

.body > :deep(.comments) {
    flex: 1;
}
.head {
    position: sticky;
    top: 0;
    z-index: 2;
    margin: -16px -20px 0;
    padding: 16px 20px 8px;
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
    color: var(--accent-text);
}
.age {
    flex: 1;
}
.title {
    margin: 10px 0 0;
    font-size: 19px;
    font-weight: 600;
    line-height: 1.3;
}
.abstract {
    margin: 12px 0 8px;
    color: var(--text-2);
}
.block {
    margin-top: 16px;
}
.block h3 {
    margin: 0 0 4px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-3);
    text-transform: uppercase;
    letter-spacing: 0.04em;
}
.text {
    white-space: pre-wrap;
    color: var(--text-2);
}
.file {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--accent-text);
}
.what {
    color: var(--text-3);
}
.foot {
    margin-top: 18px;
    color: var(--text-3);
    font-size: 11.5px;
}
.controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}
</style>
