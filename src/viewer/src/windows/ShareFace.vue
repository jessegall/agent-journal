<script setup>
import {computed, ref, shallowRef, watch} from "vue";
import Icon from "../kit/Icon.vue";
import Notice from "../kit/Notice.vue";
import ShareStrip from "./ShareStrip.vue";
import ShareTimeline from "./ShareTimeline.vue";
import WindowHost from "./WindowHost.vue";

const WIDE_SCREEN = 760;
const LOOKS = {plan: {noun: "plan", icon: "plan", window: "plans.plans", row: "plans"}};

const props = defineProps({
    session: {type: Object, default: null},
    read: {type: Function, required: true},
    subscriptions: {type: Object, required: true},
    entry: {type: Object, default: null},
    load: {type: Function, default: (url) => import(/* @vite-ignore */ url)},
});
const component = shallowRef(null);
const phases = ref([]);
const facts = ref([]);
const failed = ref(false);
const reconnecting = ref(false);
const share = computed(() => props.session?.share ?? null);
const look = computed(() => LOOKS[share.value?.row_model] ?? null);
const arrangement = computed(() => (window.innerWidth >= WIDE_SCREEN ? "beside" : "stacked"));
const ends = computed(() => (share.value ? new Date(share.value.ends_at).toLocaleDateString(undefined, {day: "numeric", month: "long", year: "numeric"}) : ""));
const gone = computed(() => failed.value || !share.value || !look.value);
const options = computed(() => ({open: `${look.value.row}:${share.value.row_id}`}));
const readProgress = ref(-1);

const counted = (count, word) => `${count} ${word}${count === 1 ? "" : "s"}`;

async function fetchFacts() {
    const id = String(share.value.row_id);
    const [progress, listed] = await Promise.all([
        props.read(look.value.window, ["plan", "progress", id], share.value.environment),
        props.read(look.value.window, ["phase", "list", "--plan", id, "--oldest"], share.value.environment),
    ]);
    if (!progress.ok || !listed.ok) {
        const unreachable = [progress, listed].some((answer) => answer.failure === "unreachable");
        failed.value = !unreachable;
        reconnecting.value = unreachable;
        return;
    }
    reconnecting.value = false;
    phases.value = listed.value.rows;
    facts.value = [counted(listed.value.total, "phase"), counted(progress.value.task_count, "task")];
}

watch(
    () => props.entry?.entry_url,
    async (url) => {
        if (url && !props.entry.unavailable_reason) component.value = (await props.load(url)).default;
    },
    {immediate: true},
);
watch(share, (shown) => shown && look.value && fetchFacts(), {immediate: true});
</script>

<template>
    <div class="share-face" :data-face="'share'">
        <template v-if="gone">
            <main class="gone">
                <Icon name="lock" :size="18" />
                <h1>This link doesn't open anything</h1>
                <p>It may have ended, or the address is not complete.</p>
            </main>
        </template>
        <template v-else>
            <template v-if="reconnecting">
                <Notice role="status">Reconnecting…</Notice>
            </template>
            <ShareStrip :icon="look.icon" :noun="look.noun" :facts="facts" :ends="ends" :read="readProgress" />
            <div class="share-body" data-share-body :data-arrangement="arrangement">
                <div class="share-part" data-share-part="plan">
                    <WindowHost :name="look.window" :component="component" :subscriptions="subscriptions" :environment="share.environment" :options="options" />
                </div>
                <ShareTimeline :phases="phases" />
            </div>
            <footer class="share-footer">Shared from an agent journal</footer>
        </template>
    </div>
</template>

<style scoped>
.share-face {
    --kind: var(--progress);
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: var(--bg);
}

.share-body {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr) auto;
}

.share-body[data-arrangement="beside"] {
    grid-template-columns: minmax(0, 1fr) 340px;
    grid-template-rows: minmax(0, 1fr);
}

.share-part {
    min-height: 0;
    min-width: 0;
    overflow-y: auto;
}

.share-footer {
    flex: none;
    padding: 8px 32px 16px;
    color: var(--text-4);
    font-size: 12px;
    text-align: center;
}

.gone {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 24px;
    color: var(--text-3);
    text-align: center;
}

.gone h1 {
    margin: 6px 0 0;
    color: var(--text);
    font-size: 17px;
    font-weight: 600;
}

.gone p {
    margin: 0;
}
</style>
