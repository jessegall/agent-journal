<script setup>
import {computed, ref} from "vue";
import Btn from "../kit/Btn.vue";
import ChatDock from "../kit/ChatDock.vue";
import CloseButton from "../kit/CloseButton.vue";
import Icon from "../kit/Icon.vue";
import {api} from "../api/client.js";
import {peek} from "../route.js";
import {isUpdate, updateCounts, updateLabel} from "../domain/updates.js";
import {words} from "../text/words.js";
import {openUpdate} from "./updateView.js";

const props = defineProps({report: Object, folded: Boolean});
const dock = ref(null);
const update = computed(() => isUpdate(props.report));
const label = computed(() => (update.value ? updateLabel(props.report) : `Report ${props.report.n}`));
const facts = computed(() =>
    updateCounts(props.report)
        .map((c) => `${c.n} ${c.label}`)
        .join(" · ")
);
const lead = computed(() => words(props.report.abstract || String(props.report.brief || "").split("\n")[0]));

function open() {
    if (update.value) openUpdate(props.report.n, dock.value.card);
    else peek("report", props.report.n);
}
</script>

<template>
    <ChatDock ref="dock" :label="update ? 'Update report' : 'Report'" :folded="folded">
        <template #head>
            <Icon name="report" class="report-dock-icon" />
            <button type="button" class="report-dock-label" :title="update ? 'Open the update' : 'Open the report'" @click="open">
                {{ label }}
            </button>
            <template v-if="update">
                <span class="report-dock-facts">{{ facts }}</span>
            </template>
            <template v-else>
                <span class="report-dock-title">· {{ words(report.title) }}</span>
            </template>
            <span class="report-dock-acts chat-dock-acts">
                <Btn small @click="open">{{ update ? "Open update" : "Open report" }}</Btn>
            </span>
            <CloseButton
                title="Take this report out of the chat; it stays on the Reports page"
                @click="api.act('report', report.n, 'dismiss')"
            />
        </template>
        <template v-if="lead">
            <button type="button" class="report-dock-lead" @click="open">{{ lead }}</button>
        </template>
    </ChatDock>
</template>

<style scoped>
.report-dock-icon {
    flex: none;
    color: var(--text-3);
}

.report-dock-label {
    flex: none;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text);
    font: inherit;
    font-weight: 500;
    cursor: pointer;
}

.report-dock-label:hover {
    text-decoration: underline;
    text-decoration-color: var(--text-4);
    text-underline-offset: 3px;
}

.report-dock-facts,
.report-dock-title {
    flex: 0 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
}

.report-dock-facts {
    color: var(--text-4);
    font-size: 12px;
}

.report-dock-title {
    color: var(--text-2);
    font-size: 12.5px;
}

.report-dock-acts {
    flex: none;
    display: flex;
    align-items: center;
    margin-left: auto;
}

.report-dock-lead {
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
    .report-dock-facts {
        display: none;
    }
}
</style>
