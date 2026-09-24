<script setup>
import {computed, ref, watch} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import CopyButton from "../kit/CopyButton.vue";
import Icon from "../kit/Icon.vue";
import {usePoll} from "../poll.js";
import {peek} from "../route.js";
import {useOutside} from "../composables/outside.js";
import {
    approveShare,
    checkTunnel,
    endsOf,
    itemOf,
    locked,
    openShares,
    stopShare,
    tunnelStatus,
    viewsOf,
    waitingShares,
} from "../composables/shares.js";
import TunnelProblem from "../resource/TunnelProblem.vue";

const SERVICES_EVERY = 5000;
const TUNNEL = "sharing.tunnel";
const drop = ref(false);
const wrap = ref(null);
const services = ref([]);
const stopping = ref(0);
const error = ref("");
useOutside(wrap, () => (drop.value = false));
usePoll(
    "share-services",
    () => api.services(),
    SERVICES_EVERY,
    (got) => (services.value = got || [])
);
watch(drop, (open) => open && checkTunnel());

const tunnel = computed(() => services.value.find((s) => s.id === TUNNEL));
const state = computed(() => {
    if (!openShares.value.length) return {key: "waiting", word: "Waiting for you"};
    if (tunnelStatus.value && !tunnelStatus.value.installed) return {key: "down", word: "tunler isn't installed"};
    if (tunnelStatus.value && !tunnelStatus.value.logged_in) return {key: "down", word: "tunler isn't logged in"};
    if (!tunnel.value) return {key: "starting", word: "Starting"};
    if (tunnel.value.state === "ready") return {key: "up", word: "Open"};
    if (tunnel.value.state === "starting") return {key: "starting", word: "Starting"};
    return {key: "down", word: tunnel.value.why || "Not running"};
});
const address = computed(() => tunnelStatus.value?.address || openShares.value[0]?.abstract.replace(/^https:\/\/([^/]+).*$/, "$1") || "");

function open(share) {
    const [type, n] = itemOf(share).ref.split(":");
    drop.value = false;
    peek(type, Number(n));
}

async function approve(share) {
    error.value = "";
    stopping.value = share.n;
    try {
        await approveShare(share);
    } catch (e) {
        error.value = e.message;
    } finally {
        stopping.value = 0;
    }
}

async function stop(shares) {
    error.value = "";
    stopping.value = shares.length > 1 ? -1 : shares[0].n;
    try {
        for (const share of shares) await stopShare(share);
    } catch (e) {
        error.value = e.message;
    } finally {
        stopping.value = 0;
    }
}
</script>

<template>
    <div ref="wrap" class="drop-wrap">
        <button
            type="button"
            :class="['icon-btn', 'tunnel-btn', state.key, {on: drop}]"
            :title="
                waitingShares.length
                    ? `Sharing: ${waitingShares.length} waiting for you`
                    : `Sharing: ${openShares.length} open ${openShares.length === 1 ? 'link' : 'links'}`
            "
            :aria-expanded="drop"
            @click="drop = !drop"
        >
            <Icon name="tunnel" />
            <span class="tunnel-dot" />
        </button>
        <Transition name="drop">
            <div v-if="drop" class="drop tunnel-drop">
                <div class="tunnel-head">
                    <span class="tunnel-title">Sharing</span>
                    <span :class="['tunnel-state', state.key]">
                        <span class="state-dot" />
                        {{ state.word }}
                    </span>
                </div>
                <template v-if="address">
                    <div class="tunnel-address" :title="address">{{ address }}</div>
                </template>
                <template v-if="tunnelStatus && (!tunnelStatus.installed || !tunnelStatus.logged_in)">
                    <div class="tunnel-problem-wrap">
                        <TunnelProblem :status="tunnelStatus" />
                    </div>
                </template>
                <template v-if="waitingShares.length">
                    <div class="tunnel-shares">
                        <span class="tunnel-group">Waiting for you</span>
                        <template v-for="share in waitingShares" :key="share.n">
                            <div class="tunnel-share waiting">
                                <div class="tunnel-share-head">
                                    <button type="button" class="tunnel-item" @click="open(share)">{{ itemOf(share).title }}</button>
                                    <template v-if="locked(share)">
                                        <Icon class="lock" name="lock" :size="11" title="Has a password" />
                                    </template>
                                </div>
                                <div class="tunnel-share-row">
                                    <span class="tunnel-link">The agent wants to share this; no link works until you accept.</span>
                                    <Btn small kind="primary" :busy="stopping === share.n" @click="approve(share)">Accept</Btn>
                                    <Btn small @click="stop([share])">Deny</Btn>
                                </div>
                            </div>
                        </template>
                    </div>
                </template>
                <div class="tunnel-shares">
                    <template v-for="share in openShares" :key="share.n">
                        <div class="tunnel-share">
                            <div class="tunnel-share-head">
                                <button
                                    type="button"
                                    class="tunnel-item"
                                    :title="`Open ${itemOf(share).ref.replace(':', ' ')}`"
                                    @click="open(share)"
                                >
                                    {{ itemOf(share).title }}
                                </button>
                                <span class="meta">{{ viewsOf(share) }} · {{ endsOf(share) }}</span>
                            </div>
                            <div class="tunnel-share-row">
                                <span class="tunnel-link" :title="share.abstract">
                                    <template v-if="locked(share)">
                                        <Icon class="lock" name="lock" :size="11" title="Has a password" />
                                    </template>
                                    {{ share.abstract.replace(/^https:\/\/[^/]+/, "") }}
                                </span>
                                <CopyButton :text="share.abstract" />
                                <Btn small kind="danger" :busy="stopping === share.n" @click="stop([share])">Stop sharing</Btn>
                            </div>
                        </div>
                    </template>
                </div>
                <template v-if="error">
                    <p class="tunnel-error">{{ error }}</p>
                </template>
                <div class="tunnel-foot">
                    <span class="meta">The tunnel closes by itself when the last link ends.</span>
                    <template v-if="openShares.length > 1">
                        <Btn small kind="danger" :busy="stopping === -1" @click="stop(openShares)">Stop every share</Btn>
                    </template>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.drop-wrap {
    position: relative;
}

.icon-btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: var(--text-3);
}

.icon-btn:hover,
.icon-btn.on {
    background: var(--hover);
    color: var(--text);
}

.icon-btn .ico {
    width: 15px;
    height: 15px;
}

.tunnel-dot {
    position: absolute;
    right: 4px;
    bottom: 5px;
    width: 6px;
    height: 6px;
    border: 1.5px solid var(--bg);
    border-radius: 50%;
    background: var(--tone-good);
}

.tunnel-btn.starting .tunnel-dot {
    background: var(--tone-warn);
}

.tunnel-btn.waiting .tunnel-dot,
.tunnel-state.waiting .state-dot {
    background: var(--accent-text);
}

.tunnel-btn.down .tunnel-dot {
    background: var(--danger);
}

.drop {
    position: absolute;
    top: 34px;
    right: 0;
    z-index: 95;
    display: flex;
    flex-direction: column;
    width: 380px;
    max-width: calc(100vw - 24px);
    max-height: 70vh;
    overflow: hidden auto;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: var(--side);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
}

@media (max-width: 640px) {
    .drop {
        position: fixed;
        top: 52px;
        right: 12px;
        left: 12px;
        width: auto;
        max-width: none;
    }
}

.tunnel-head {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px 2px;
}

.tunnel-title {
    flex: 1;
    color: var(--text);
    font-size: 13px;
    font-weight: 600;
}

.tunnel-state {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    color: var(--text-2);
    font-size: 12px;
}

.state-dot {
    flex: none;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--tone-good);
}

.tunnel-state.starting .state-dot {
    background: var(--tone-warn);
}

.tunnel-state.down .state-dot {
    background: var(--danger);
}

.tunnel-address {
    overflow: hidden;
    padding: 0 12px 10px;
    color: var(--text-3);
    font-family: var(--mono, ui-monospace, monospace);
    font-size: 11.5px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.tunnel-problem-wrap {
    padding: 0 12px 10px;
}

.tunnel-shares {
    display: flex;
    flex-direction: column;
    border-top: 1px solid var(--border);
}

.tunnel-share {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 10px 12px;
    border-bottom: 1px solid var(--border);
}

.tunnel-share-head {
    display: flex;
    align-items: baseline;
    gap: 8px;
    min-width: 0;
}

.tunnel-item {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text);
    font: inherit;
    font-size: 13px;
    font-weight: 500;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
}

.tunnel-item:hover {
    color: var(--accent-text);
}

.tunnel-group {
    padding: 8px 12px 0;
    color: var(--text-3);
    font-size: 11.5px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.tunnel-share.waiting .tunnel-link {
    font-family: inherit;
    white-space: normal;
}

.lock {
    flex: none;
    margin-right: 4px;
    color: var(--text-3);
    vertical-align: -1px;
}

.tunnel-share-row {
    display: flex;
    align-items: center;
    gap: 6px;
}

.tunnel-link {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    color: var(--text-3);
    font-family: var(--mono, ui-monospace, monospace);
    font-size: 11.5px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.meta {
    flex: none;
    color: var(--text-3);
    font-size: 11.5px;
}

.tunnel-foot {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
}

.tunnel-foot .meta {
    flex: 1;
    white-space: normal;
}

.tunnel-error {
    margin: 0;
    padding: 8px 12px 0;
    color: var(--danger);
    font-size: 12px;
}
</style>
