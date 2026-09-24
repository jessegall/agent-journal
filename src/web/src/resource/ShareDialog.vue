<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import CopyButton from "../kit/CopyButton.vue";
import Dialog from "../kit/Dialog.vue";
import Icon from "../kit/Icon.vue";
import Segmented from "../kit/Segmented.vue";
import Spinner from "../kit/Spinner.vue";
import Switch from "../kit/Switch.vue";
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
const comments = ref(false);
const waiting = waitingOf(ref_.value);
const kind = computed(() => KINDS[props.resource.type] || props.resource.type);
const opens = ref(null);
const error = ref("");
const making = ref(false);
const made = ref(null);
const WAIT_EVERY = 1500;
const WAIT_FOR = 45000;
const tunnel = ref("");
let pause = 0;
const listed = ref(false);
const NOUNS = {todo: "to-do", doc: "document"};
const nounOf = (type) => NOUNS[type] || KINDS[type] || type;
const summary = computed(() => {
    if (!opens.value || !opens.value.length) return null;
    const [first, ...rest] = opens.value;
    const named = /^(.*) \((\w+) (\d+)\)$/.exec(first);
    const files = rest.filter((line) => line.startsWith("its "));
    const types = rest.filter((line) => !line.startsWith("its ")).map((line) => (/\((\w+) \d+\)$/.exec(line) || [])[1] || "");
    const noun = new Set(types).size === 1 ? nounOf(types[0]) : "item";
    const members = types.length ? [`its ${types.length} ${noun}${types.length === 1 ? "" : "s"}`] : [];
    return {
        title: named ? named[1] : first,
        ref: named ? ` (${nounOf(named[2])} ${named[3]})` : "",
        tail: `${[...files, ...members]
            .map((part) => ` and ${part}`)
            .join("")
            .replace(" and its ", ", its ")}, and nothing else.`,
    };
});
const message = (link) => `Here's the link to ${props.resource.title}: ${link}`;

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
        made.value = await api.create("share", {
            title: ref_.value,
            expires: expires.value,
            password: password.value,
            comments: comments.value,
        });
        password.value = "";
        awaitLink(made.value);
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
    <Dialog small fixed title="Share" @close="emit('close')">
        <div class="share">
            <template v-if="blocked">
                <TunnelProblem :status="tunnelStatus" @ready="loggedIn" />
            </template>
            <template v-if="made">
                <template v-if="tunnel === 'starting'">
                    <div class="starting">
                        <Spinner />
                        <span>
                            Getting the link ready…
                            <span class="meta">Usually a few seconds.</span>
                        </span>
                    </div>
                </template>
                <template v-else>
                    <div class="made">
                        <span class="made-head">
                            <Icon name="tick" :size="12" />
                            Anyone with this link can view it
                        </span>
                        <div class="link-row">
                            <input class="link" :value="made.abstract" readonly @focus="$event.target.select()" />
                            <CopyButton :text="made.abstract" label="Copy" />
                            <CopyButton
                                :text="message(made.abstract)"
                                icon="chat"
                                label="Copy with message"
                                hint="Copy it with a line saying what it is"
                            />
                        </div>
                        <template v-if="tunnel === 'late'">
                            <p class="late">It doesn't open from outside yet; give it a moment.</p>
                        </template>
                        <span class="meta">
                            {{ endsOf(made) === "never ends" ? "It never ends" : `It ${endsOf(made)}` }} · you can stop it here at any time
                        </span>
                    </div>
                </template>
            </template>
            <template v-else>
                <template v-if="opens === null">
                    <p class="quiet">Working out what the link opens…</p>
                </template>
                <template v-else-if="summary">
                    <div class="opens">
                        <p class="opens-line">
                            <span>The link opens</span>
                            <strong>{{ summary.title }}</strong>
                            <span class="ref">{{ summary.ref }}</span>
                            <span>{{ summary.tail }}</span>
                            <template v-if="opens.length > 1">
                                <Btn kind="icon" small class="show" @click="listed = !listed">{{ listed ? "Hide" : "Show" }}</Btn>
                            </template>
                        </p>
                        <template v-if="listed">
                            <ul class="opens-list">
                                <template v-for="line in opens.slice(1)" :key="line">
                                    <li>{{ line }}</li>
                                </template>
                            </ul>
                        </template>
                    </div>
                </template>
                <div class="rows">
                    <div class="row">
                        <span class="label">Ends after</span>
                        <Segmented :options="EXPIRES" :value="expires" @pick="(key) => (expires = key)" />
                    </div>
                    <div class="row">
                        <span class="label">Password</span>
                        <TextInput
                            class="password"
                            type="password"
                            autocomplete="new-password"
                            :value="password"
                            placeholder="None"
                            aria-label="Password"
                            @input="password = $event.target.value"
                        />
                    </div>
                    <template v-if="password">
                        <p class="quiet hint">Visitors enter any name and this password.</p>
                    </template>
                    <div class="row">
                        <span class="label">Visitors can comment</span>
                        <Switch :on="comments" title="Let visitors comment under a name of their own" @change="comments = $event" />
                    </div>
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
                            <CopyButton :text="share.abstract" hint="Copy the link" />
                            <CopyButton :text="message(share.abstract)" icon="chat" hint="Copy it with a line saying what it is" />
                            <Btn small kind="danger" :busy="stopping === share.n" @click="stop(share)">Stop sharing</Btn>
                        </div>
                    </template>
                </section>
            </template>
        </div>
        <template v-if="!made" #foot>
            <Btn kind="primary" :busy="making" :disabled="!opens || !opens.length || blocked" @click="create">
                <Icon name="share" :size="12" />
                Create link
            </Btn>
        </template>
    </Dialog>
</template>

<style scoped>
.share {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.opens-line {
    margin: 0;
    color: var(--text-2);
    font-size: 13px;
    line-height: 1.55;
}

.opens-line strong {
    margin-left: 0.3em;
    color: var(--text);
    font-weight: 500;
}

.ref {
    color: var(--text-3);
}

.show.btn,
.show.btn:hover {
    height: auto;
    margin-left: 6px;
    padding: 0;
    background: none;
    color: var(--accent-text);
    font-size: 12.5px;
    vertical-align: baseline;
}

.opens-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 8px 0 0;
    padding: 0 0 0 14px;
    color: var(--text-3);
    font-size: 12.5px;
    line-height: 1.45;
}

.rows {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-top: 14px;
    border-top: 1px solid var(--border);
}

.row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 6px 12px;
    min-height: 30px;
}

.row .password {
    flex: 0 1 200px;
    min-width: 0;
}

.hint {
    margin-top: -4px;
    text-align: right;
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

.quiet,
.meta {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
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
    flex-wrap: wrap;
    gap: 6px;
}

.link-row .link {
    flex: 1 1 220px;
}

.starting {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--raised);
    color: var(--text);
    font-size: 13px;
}

.starting .meta {
    display: block;
    margin-top: 2px;
}

.late {
    margin: 0;
    color: var(--tone-warn);
    font-size: 12px;
    line-height: 1.5;
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
