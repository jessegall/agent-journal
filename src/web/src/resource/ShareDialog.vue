<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import {api} from "../api/client.js";
import {store} from "../state/store.js";
import Btn from "../kit/Btn.vue";
import Dialog from "../kit/Dialog.vue";
import Icon from "../kit/Icon.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import TabBar from "../kit/TabBar.vue";
import {KINDS, approveShare, checkTunnel, sharesOf, stopShare, tunnelStatus, waitingOf} from "../composables/shares.js";
import TunnelProblem from "./TunnelProblem.vue";
import OpenShareList from "./OpenShareList.vue";
import ShareMadeLink from "./ShareMadeLink.vue";
import ShareOpens from "./ShareOpens.vue";
import ShareSettings from "./ShareSettings.vue";

const props = defineProps({resource: {type: Object, required: true}});
const emit = defineEmits(["close"]);
const ref_ = computed(() => `${props.resource.type}:${props.resource.n}`);
const expires = ref("7d");
const password = ref("");
const comments = ref(false);
const agentReplies = ref(true);
const waiting = waitingOf(ref_.value);
const kind = computed(() => KINDS[props.resource.type] || props.resource.type);
const opens = ref(null);
const error = ref("");
const making = ref(false);
const made = ref(null);
const WAIT_EVERY = 1500;
const WAIT_FOR = 30000;
const tunnel = ref("");
let pause = 0;

async function awaitLink(share) {
    const until = Date.now() + WAIT_FOR;
    tunnel.value = "starting";
    while (tunnel.value === "starting") {
        const got = await api.command("share", "reachable", {n: share.n}).catch(() => ({}));
        if (tunnel.value !== "starting") return;
        if (got.reachable) tunnel.value = "ready";
        else if (Date.now() > until) tunnel.value = "late";
        else await new Promise((done) => (pause = setTimeout(done, WAIT_EVERY)));
    }
}

onUnmounted(() => {
    clearTimeout(pause);
    tunnel.value = "closed";
});
const stopping = ref(0);
const open = sharesOf(ref_.value);
const tab = ref(waiting.value.length ? "open" : "new");
const tabs = computed(() => [
    {key: "new", title: "New link"},
    {key: "open", title: "Open links", count: open.value.length + waiting.value.length},
]);
const loggedIn = (status) => (store.tunnel = status);
const blocked = computed(() => tunnelStatus.value && (!tunnelStatus.value.installed || !tunnelStatus.value.logged_in));

onMounted(async () => {
    checkTunnel();
    try {
        opens.value = await api.command("share", "opens", {ref: ref_.value});
    } catch (e) {
        error.value = e.message;
        opens.value = [];
    }
});

async function create() {
    making.value = true;
    error.value = "";
    try {
        made.value = await api.create("share", {
            title: ref_.value,
            expires: expires.value,
            password: password.value,
            comments: comments.value,
            agent_replies: agentReplies.value,
        });
        password.value = "";
        awaitLink(made.value);
    } catch (e) {
        error.value = e.message;
    } finally {
        making.value = false;
    }
}

function checkAgain() {
    if (made.value) awaitLink(made.value);
}

function another() {
    tunnel.value = "";
    made.value = null;
}

async function approve(share) {
    stopping.value = share.n;
    try {
        await approveShare(share);
    } catch (e) {
        error.value = e.message;
    } finally {
        stopping.value = 0;
    }
}

async function stop(share) {
    stopping.value = share.n;
    try {
        await stopShare(share);
        if (made.value?.n === share.n) made.value = null;
    } catch (e) {
        error.value = e.message;
    } finally {
        stopping.value = 0;
    }
}
</script>

<template>
    <Dialog small tall title="Share" @close="emit('close')">
        <div class="share">
            <div class="tabs-row">
                <TabBar v-model="tab" :tabs="tabs" />
            </div>
            <Transition name="pane" mode="out-in">
                <div :key="tab" class="pane">
                    <SwitchCase :value="tab">
                        <template #new>
                            <template v-if="blocked">
                                <TunnelProblem :status="tunnelStatus" @ready="loggedIn" />
                            </template>
                            <template v-if="made">
                                <ShareMadeLink :made="made" :tunnel="tunnel" :title="resource.title" @check-again="checkAgain" />
                            </template>
                            <template v-else>
                                <ShareOpens :opens="opens" />
                                <ShareSettings
                                    v-model:expires="expires"
                                    v-model:password="password"
                                    v-model:comments="comments"
                                    v-model:agent-replies="agentReplies"
                                />
                            </template>
                        </template>
                        <template #open>
                            <OpenShareList
                                :waiting="waiting"
                                :open="open"
                                :kind="kind"
                                :title="resource.title"
                                :stopping="stopping"
                                @approve="approve"
                                @stop="stop"
                            />
                        </template>
                    </SwitchCase>
                    <template v-if="error">
                        <p class="error">{{ error }}</p>
                    </template>
                </div>
            </Transition>
        </div>
        <template v-if="tab === 'new'" #foot>
            <template v-if="made">
                <Btn @click="another">Make another</Btn>
                <Btn kind="primary" @click="emit('close')">Done</Btn>
            </template>
            <template v-else>
                <Btn kind="primary" :busy="making" :disabled="!opens || !opens.length || blocked" @click="create">
                    <Icon name="share" :size="12" />
                    Create link
                </Btn>
            </template>
        </template>
    </Dialog>
</template>

<style scoped>
.share {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 16px;
    min-height: 0;
}

.tabs-row {
    flex: none;
    border-bottom: 1px solid var(--border);
}

.tabs-row :deep(.tab) {
    padding-bottom: 8px;
    margin-bottom: -1px;
}

.pane {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 16px;
    min-height: 0;
}

.pane-enter-active,
.pane-leave-active {
    transition:
        opacity 0.16s ease,
        transform 0.16s ease;
}

.pane-enter-from {
    opacity: 0;
    transform: translateY(4px);
}

.pane-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
    .pane-enter-active,
    .pane-leave-active {
        transition: none;
    }
}

.part {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.error {
    margin: 0;
    color: var(--danger);
    font-size: 12.5px;
}
</style>
