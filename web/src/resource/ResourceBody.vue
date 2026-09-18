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
import Comments from "./Comments.vue";
import Links from "./Links.vue";

const props = defineProps({resource: Object});
const emit = defineEmits(["close"]);
const kind = computed(() => meta(props.resource.type));
const files = computed(() => Object.entries(props.resource.data.files || {}));
</script>

<template>
    <article class="body">
        <header class="top">
            <span class="kind">
                <Icon :name="kind.icon" :size="13" />
                {{ kind.title }} {{ resource.n }}
            </span>
            <span class="age">{{ age(resource.created) }}</span>
            <Btn kind="icon" @click="emit('close')"><Icon name="x" /></Btn>
        </header>
        <h2 class="title">{{ resource.title }}</h2>
        <p v-if="resource.abstract" class="abstract">{{ resource.abstract }}</p>
        <ResourceActions :resource="resource" />
        <OptionsPicker v-if="kind.fields.options" :resource="resource" />
        <section v-if="resource.brief" class="block">
            <h3 v-if="kind.labels.brief">{{ kind.labels.brief }}</h3>
            <div class="text">{{ resource.brief }}</div>
        </section>
        <Sections :sections="resource.sections" />
        <section v-if="resource.completed" class="block">
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
        <section v-if="files.length" class="block">
            <h3>Files</h3>
            <a
                v-for="[name, what] in files"
                :key="name"
                class="file"
                :href="fileUrl(route.env, resource.type, resource.n, name)"
                target="_blank"
            >
                <Icon name="clip" :size="13" />
                {{ name }}
                <span v-if="what" class="what">— {{ what }}</span>
            </a>
        </section>
        <Links :resource="resource" />
        <Comments :resource="resource" />
        <footer class="foot">seen by {{ resource.seen.join(", ") || "nobody" }}</footer>
    </article>
</template>

<style scoped>
.body {
    padding: 16px 20px 30px;
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
    margin: 10px 0 4px;
    font-size: 19px;
    font-weight: 600;
    line-height: 1.3;
}
.abstract {
    margin: 0 0 8px;
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
    margin-top: 22px;
    color: var(--text-3);
    font-size: 11.5px;
}
</style>
