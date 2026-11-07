<script setup>
import {ref, watch} from "vue";
import {shareAddress} from "../route.js";
import BackButton from "../kit/BackButton.vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import Segmented from "../kit/Segmented.vue";
import Skeleton from "../kit/Skeleton.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import QuickCommentBar from "../kit/QuickCommentBar.vue";
import {useTextComments} from "../composables/textComments.js";
import {useResourceEvents} from "./resourceEvents.js";
import RowMoves from "./RowMoves.vue";
import CommentSide from "./CommentSide.vue";
import PlanDetails from "./PlanDetails.vue";
import PlanTimeline from "./PlanTimeline.vue";

const props = defineProps({id: {type: Number, required: true}, read: {type: Function, required: true}, environment: {type: String, required: true}, readOnly: Boolean, backed: Boolean});
const emit = defineEmits(["close", "back", "select", "open"]);
const TABS = [
    {key: "details", label: "Details"},
    {key: "comments", label: "Comments"},
    {key: "timeline", label: "Timeline"},
];
const tab = ref("details");
const plan = ref(null);
const failure = ref("");
const textComments = useTextComments(() => (plan.value ? {noun: "plan", id: props.id, title: plan.value.title} : {}), (line) => props.read(line));
let reading = 0;

async function load() {
    const turn = ++reading;
    const answer = await props.read(["plan", "inspect", String(props.id)]);
    if (turn !== reading) return;
    failure.value = answer.ok ? "" : answer.error;
    plan.value = answer.ok ? answer.value : null;
}

watch(() => props.id, () => {
    plan.value = null;
    tab.value = "details";
    load();
}, {immediate: true});
useResourceEvents(["plan.*"], load);
async function sendComment(text) {
    await textComments.send(text);
    tab.value = "comments";
}
</script>

<template>
    <article class="plan-inspector" data-plan-inspector>
        <div class="top">
            <template v-if="backed">
                <BackButton @back="emit('back')" />
            </template>
            <span class="crumb">Plan {{ id }}</span>
            <span class="grow" />
            <a class="share-link" data-resource-share :href="shareAddress(`plans:${id}`)">Share</a>
            <Btn small aria-label="Close the plan (Esc)" data-resource-close @click="emit('close')"><Icon name="close" :size="13" /></Btn>
        </div>
        <template v-if="failure">
            <p class="failure" role="alert" data-resource-failure>{{ failure }}</p>
        </template>
        <template v-else-if="!plan">
            <div class="body"><Skeleton /></div>
        </template>
        <template v-else>
            <RowMoves noun="plan" :id="id" :row="plan" :read="read" @done="load" />
            <header class="summary">
                <div class="stamp">Plan {{ plan.id }}</div>
                <h3 class="title" data-resource-title>{{ plan.title }}</h3>
            </header>
            <div class="tabs" data-plan-tabs>
                <Segmented :options="TABS" :value="tab" @pick="tab = $event" />
            </div>
            <div class="panels">
                <SwitchCase :value="tab">
                    <template #details>
                        <PlanDetails :plan="plan" :read="read" :environment="environment" :read-only="readOnly" @done="load" @select="emit('select', $event)" @open="emit('open', $event)" />
                    </template>
                    <template #comments>
                        <CommentSide below :comments="textComments.comments.value" :words="textComments.words" :more="Boolean(textComments.nextPage.value)" :loading="textComments.loading.value" :failure="textComments.failure.value" @more="textComments.loadMore" @close="tab = 'details'" />
                    </template>
                    <template #timeline>
                        <div class="body"><PlanTimeline :id="id" :read="read" @select="emit('select', $event)" /></div>
                    </template>
                </SwitchCase>
            </div>
            <QuickCommentBar :send="sendComment" :count="textComments.total.value" @show="tab = 'comments'" />
        </template>
    </article>
</template>

<style scoped>
.plan-inspector {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
}
.top {
    display: flex;
    flex: none;
    align-items: center;
    gap: 4px;
    height: 44px;
    padding: 0 8px 0 20px;
    border-bottom: 1px solid var(--border);
    color: var(--text-3);
    font-size: 12px;
}
.crumb {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.grow {
    flex: 1;
}
.share-link {
    margin-right: 8px;
    color: var(--text-2);
    font-size: 12px;
    text-decoration: none;
}
.body {
    flex: 1;
    overflow: auto;
    padding: 18px 20px 28px;
    scrollbar-width: thin;
}
.failure {
    flex: 1;
    margin: 0;
    padding: 18px 20px;
    color: var(--danger);
    font-size: 12.5px;
}
.stamp {
    color: var(--text-3);
    font-size: 12px;
}
.title {
    margin: 6px 0 14px;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.3;
    text-wrap: pretty;
    overflow-wrap: anywhere;
}
.summary {
    padding: 18px 20px 0;
}
.tabs {
    padding: 0 20px 12px;
    border-bottom: 1px solid var(--border);
}
.panels {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
}
.panels :deep(.comment-side) {
    flex: 1;
    width: auto;
    border: 0;
}
</style>
