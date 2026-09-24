<script setup>
import {computed, ref} from "vue";
import Btn from "../kit/Btn.vue";
import ChatDock from "../kit/ChatDock.vue";
import CloseButton from "../kit/CloseButton.vue";
import Icon from "../kit/Icon.vue";
import {api} from "../api/client.js";
import {updateCounts, updateLabel} from "../domain/updates.js";
import {words} from "../text/words.js";
import {openUpdate} from "./updateView.js";

const props = defineProps({report: Object, folded: Boolean});
const dock = ref(null);
const facts = computed(() =>
    updateCounts(props.report)
        .map((c) => `${c.n} ${c.label}`)
        .join(" · ")
);
const open = () => openUpdate(props.report.n, dock.value.card);
</script>

<template>
    <ChatDock ref="dock" label="Update report" :folded="folded">
        <template #head>
            <Icon name="report" class="update-dock-icon" />
            <button type="button" class="update-dock-title" title="Open the update" @click="open">{{ updateLabel(report) }}</button>
            <span class="update-dock-facts">{{ facts }}</span>
            <span class="update-dock-acts">
                <Btn small @click="open">Open update</Btn>
            </span>
            <CloseButton
                title="Take this update out of the chat; it stays under Updates on the Reports page"
                @click="api.act('report', report.n, 'dismiss')"
            />
        </template>
        <template v-if="report.abstract">
            <button type="button" class="update-dock-lead" @click="open">{{ words(report.abstract) }}</button>
        </template>
    </ChatDock>
</template>

<style scoped>
.update-dock-icon {
    flex: none;
    color: var(--text-3);
}

.update-dock-title {
    flex: none;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text);
    font: inherit;
    font-weight: 500;
    cursor: pointer;
}

.update-dock-title:hover {
    text-decoration: underline;
    text-decoration-color: var(--text-4);
    text-underline-offset: 3px;
}

.update-dock-facts {
    flex: 0 1 auto;
    min-width: 0;
    overflow: hidden;
    color: var(--text-4);
    font-size: 12px;
    text-overflow: ellipsis;
}

.update-dock-acts {
    flex: none;
    display: flex;
    align-items: center;
    margin-left: auto;
}

.update-dock-lead {
    display: block;
    width: 100%;
    margin: 0;
    padding: 0 16px 9px 41px;
    overflow: hidden;
    border: 0;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 11.5px;
    line-height: 1.45;
    text-align: left;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
}

@container (max-width: 420px) {
    .update-dock-facts {
        display: none;
    }
}

@container (max-width: 300px) {
    .update-dock-acts {
        display: none;
    }
}
</style>
