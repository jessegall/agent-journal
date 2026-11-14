<script setup>
import {computed, inject} from "vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import InspectorBack from "./InspectorBack.vue";
import {copying} from "../domain/contextItems.js";
import {inspectorWidth} from "../domain/inspectorWidths.js";
import {INSPECTOR_HOST} from "../windows/windowContext.js";
import WindowPane from "../windows/WindowPane.vue";
import {ref} from "vue";

// the file inspector: the Files browser in the widest inspector, opened on a path, the page staying under it. Its head names the first file and has the one primary button,
// Open the Files page; Copy path and Show changes in Git are its actions.
const props = defineProps({path: {type: String, default: ""}, environment: {type: String, required: true}, backed: Boolean});
const emit = defineEmits(["close", "back"]);
const host = inject(INSPECTOR_HOST, null);
const said = ref("");
const name = computed(() => props.path.split("/").pop() || "Files");
const address = (query) => `${location.pathname}?${new URLSearchParams({environment: props.environment, page: "coding.files", ...query})}`;
const filesPage = computed(() => address(props.path ? {file: props.path} : {}));
const gitPage = computed(() => `${location.pathname}?${new URLSearchParams({environment: props.environment, page: "coding.git"})}`);
const copyPath = () => copying(props.path, "the path", (text) => (said.value = text));
</script>

<template>
    <aside class="file-inspector" tabindex="-1" role="dialog" :aria-label="`File ${name}`" :style="{'--inspector-width': inspectorWidth('wide')}" data-file-inspector data-resource-panel>
        <header class="file-inspector-head">
            <div class="file-inspector-band">
                <template v-if="backed">
                    <InspectorBack @back="emit('back')" />
                </template>
                <p class="file-inspector-kind">File</p>
                <a class="btn primary small" :href="filesPage" data-file-inspector-open>Open the Files page</a>
                <Btn variant="icon" title="Close" aria-label="Close" data-resource-close @click="emit('close')"><Icon name="close" :size="13" /></Btn>
            </div>
            <h2 class="file-inspector-title" data-resource-title>{{ name }}</h2>
            <template v-if="path">
                <div class="file-inspector-actions">
                    <Btn small data-file-inspector-copy @click="copyPath">Copy path</Btn>
                    <a class="btn small" :href="gitPage" data-file-inspector-git>Show changes in Git</a>
                    <template v-if="said"><span role="status" class="file-inspector-said">{{ said }}</span></template>
                </div>
            </template>
        </header>
        <div class="file-inspector-body">
            <template v-if="host">
                <WindowPane name="coding.files" :catalogue="host.catalogue" :subscriptions="host.subscriptions" :environment="environment" :prompts="host.prompts" :shell-read="host.shellRead" :options="{start: path}" />
            </template>
        </div>
    </aside>
</template>

<style scoped>
.file-inspector {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    width: var(--inspector-width);
    min-width: 0;
    border-left: 1px solid var(--border-2);
    background: var(--bg);
    box-shadow: -20px 0 50px rgba(0, 0, 0, 0.4);
}

.file-inspector-head {
    flex: none;
    padding: 10px var(--s3) 12px var(--inset);
    border-bottom: 1px solid var(--border);
}

.file-inspector-band {
    display: flex;
    gap: 6px;
    align-items: center;
    min-height: 28px;
}

.file-inspector-kind {
    flex: 1;
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}

.file-inspector-title {
    margin: 6px 0 0;
    font-size: 17px;
    font-weight: 600;
    letter-spacing: -0.01em;
    line-height: 1.3;
}

.file-inspector-actions {
    display: flex;
    gap: 6px;
    align-items: center;
    margin-top: 8px;
}

.file-inspector-said {
    color: var(--text-3);
    font-size: 12px;
}

.file-inspector-body {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
}
</style>
