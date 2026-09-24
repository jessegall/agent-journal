<script setup>
import {computed, onMounted, ref} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import CopyButton from "../kit/CopyButton.vue";
import Dialog from "../kit/Dialog.vue";
import Icon from "../kit/Icon.vue";
import Segmented from "../kit/Segmented.vue";
import TextInput from "../kit/TextInput.vue";
import {
    KINDS,
    approveShare,
    checkTunnel,
    endsOf,
    locked,
    sharesOf,
    stopShare,
    tunnelStatus,
    viewsOf,
    waitingOf,
} from "../composables/shares.js";
import TunnelProblem from "./TunnelProblem.vue";

const props = defineProps({resource: {type: Object, required: true}});
const emit = defineEmits(["close"]);
const ref_ = computed(() => `${props.resource.type}:${props.resource.n}`);
const EXPIRES = [
    {key: "1d", label: "1 day"},
    {key: "7d", label: "7 days"},
    {key: "30d", label: "30 days"},
    {key: "never", label: "Never"},
];
const expires = ref("7d");
const password = ref("");
const waiting = waitingOf(ref_.value);
const kind = computed(() => KINDS[props.resource.type] || props.resource.type);
const opens = ref(null);
const error = ref("");
const making = ref(false);
const made = ref(null);
const stopping = ref(0);
const open = sharesOf(ref_.value);
const others = computed(() => open.value.filter((share) => share.n !== made.value?.n));
const loggedIn = (status) => (tunnelStatus.value = status);
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
        made.value = await api.create("share", {title: ref_.value, expires: expires.value, password: password.value});
        password.value = "";
    } catch (e) {
        error.value = e.message;
    } finally {
        making.value = false;
    }
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
    <Dialog small title="Share" @close="emit('close')">
        <div class="share">
            <template v-if="blocked">
                <TunnelProblem :status="tunnelStatus" @ready="loggedIn" />
            </template>
            <template v-if="made">
                <div class="made">
                    <span class="made-head">
                        <Icon name="tick" :size="12" />
                        Anyone with this link can view it
                    </span>
                    <div class="link-row">
                        <input class="link" :value="made.abstract" readonly @focus="$event.target.select()" />
                        <CopyButton :text="made.abstract" label="Copy" />
                    </div>
                    <span class="meta">
                        {{ endsOf(made) === "never ends" ? "It never ends" : `It ${endsOf(made)}` }} · you can stop it here at any time
                    </span>
                </div>
            </template>
            <template v-else>
                <section class="part">
                    <span class="label">They will be able to view:</span>
                    <template v-if="opens === null">
                        <p class="quiet">Working out what the link opens…</p>
                    </template>
                    <template v-else>
                        <ul class="opens">
                            <template v-for="line in opens" :key="line">
                                <li>{{ line }}</li>
                            </template>
                        </ul>
                        <p class="quiet">Nothing else in the journal can be reached through the link.</p>
                    </template>
                </section>
                <section class="part">
                    <span class="label">The link ends after</span>
                    <Segmented :options="EXPIRES" :value="expires" @pick="(key) => (expires = key)" />
                </section>
                <section class="part">
                    <span class="label">
                        Password
                        <span class="optional">(optional)</span>
                    </span>
                    <TextInput
                        class="password"
                        type="password"
                        autocomplete="new-password"
                        :value="password"
                        placeholder="Leave empty for no password"
                        @input="password = $event.target.value"
                    />
                    <template v-if="password">
                        <p class="quiet">Visitors get their browser's login prompt: any name, this password.</p>
                    </template>
                </section>
                <div class="actions">
                    <Btn kind="primary" :busy="making" :disabled="!opens || !opens.length || blocked" @click="create">
                        <Icon name="share" :size="12" />
                        Create link
                    </Btn>
                </div>
            </template>
            <template v-if="error">
                <p class="error">{{ error }}</p>
            </template>
            <template v-if="waiting.length">
                <section class="part open-shares">
                    <span class="label">Waiting for you</span>
                    <template v-for="share in waiting" :key="share.n">
                        <div class="open-share waiting">
                            <div class="open-share-main">
                                <span class="waiting-line">
                                    The agent wants to share this {{ kind }}
                                    <template v-if="locked(share)">
                                        <Icon class="lock" name="lock" :size="11" title="Has a password" />
                                    </template>
                                </span>
                                <span class="meta">{{ endsOf(share) }} once accepted · no link works until then</span>
                            </div>
                            <Btn small kind="primary" :busy="stopping === share.n" @click="approve(share)">Accept</Btn>
                            <Btn small @click="stop(share)">Deny</Btn>
                        </div>
                    </template>
                </section>
            </template>
            <template v-if="others.length">
                <section class="part open-shares">
                    <span class="label">Open links to this {{ kind }}</span>
                    <template v-for="share in others" :key="share.n">
                        <div class="open-share">
                            <div class="open-share-main">
                                <span class="open-link" :title="share.abstract">
                                    <template v-if="locked(share)">
                                        <Icon class="lock" name="lock" :size="11" title="Has a password" />
                                    </template>
                                    {{ share.abstract.replace(/^https:\/\/[^/]+/, "") }}
                                </span>
                                <span class="meta">{{ viewsOf(share) }} · {{ endsOf(share) }}</span>
                            </div>
                            <CopyButton :text="share.abstract" />
                            <Btn small kind="danger" :busy="stopping === share.n" @click="stop(share)">Stop sharing</Btn>
                        </div>
                    </template>
                </section>
            </template>
        </div>
    </Dialog>
</template>

<style scoped>
.share {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.part {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.label {
    color: var(--text-2);
    font-size: 12.5px;
    font-weight: 500;
}

.opens {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin: 0;
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--raised);
    list-style: none;
}

.opens li {
    color: var(--text);
    font-size: 13px;
    line-height: 1.45;
}

.opens li + li {
    color: var(--text-2);
}

.quiet,
.meta {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}

.actions {
    display: flex;
    justify-content: flex-end;
}

.made {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.made-head {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--tone-good);
    font-size: 12.5px;
    font-weight: 500;
}

.link-row {
    display: flex;
    gap: 6px;
}

.link {
    flex: 1;
    min-width: 0;
    height: 30px;
    box-sizing: border-box;
    padding: 0 10px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: var(--raised);
    color: var(--text);
    font-family: var(--mono, ui-monospace, monospace);
    font-size: 12px;
}

.link-row :deep(.copy-button) {
    height: 30px;
}

.open-shares {
    padding-top: 14px;
    border-top: 1px solid var(--border);
}

.open-share {
    display: flex;
    align-items: center;
    gap: 8px;
}

.open-share-main {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
}

.optional {
    color: var(--text-4);
    font-weight: 400;
}

.password {
    max-width: 280px;
}

.lock {
    flex: none;
    margin-right: 4px;
    color: var(--text-3);
    vertical-align: -1px;
}

.waiting-line {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--text);
    font-size: 13px;
}

.open-share.waiting {
    padding: 8px 10px;
    border: 1px dashed color-mix(in srgb, var(--accent) 45%, transparent);
    border-radius: 8px;
}

.open-link {
    overflow: hidden;
    color: var(--text);
    font-family: var(--mono, ui-monospace, monospace);
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.error {
    margin: 0;
    color: var(--danger);
    font-size: 12.5px;
}
</style>
