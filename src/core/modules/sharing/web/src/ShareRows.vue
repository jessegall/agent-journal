<script setup>
import {computed, ref} from "vue";
import {Btn, RowList, Segmented, Switch, useRows, useWindow, ListTools, useListTools} from "@journal/window-kit";

const ENDS = [
    {key: "1d", label: "1 day"},
    {key: "7d", label: "7 days"},
    {key: "30d", label: "30 days"},
    {key: "never", label: "Never"},
];

// the links of this project: a new one with what it opens, the ones an agent asks for, and the open ones with their views and comments
const context = useWindow();
const {rows, failure, loaded, load} = useRows("share list", ["share_link.*", "share_comment.*"]);
const waiting = computed(() => rows.value.filter((row) => row.state === "waiting"));
const active = computed(() => rows.value.filter((row) => row.state === "active"));
const tools = useListTools(active, {title: (row) => `${row.row_model} ${row.row_id}`});
const target = ref(new URLSearchParams(window.location.search).get("share") ?? "");
const ends = ref("7d");
const password = ref("");
const comments = ref(false);
const opens = ref(null);
const made = ref(null);
const refusal = ref("");
const commentRows = ref({});
const stoppingAll = ref(false);
const when = (row) => (row.expires_at ? `ends ${row.expires_at}` : "never ends");

async function run(line) {
    const answer = await context.run(line);
    refusal.value = answer.ok ? "" : answer.error;
    if (answer.ok) load();
    return answer;
}

// the full address uses the tunnel when one is connected, so it works outside this computer
async function address(answer) {
    const tunnel = await context.read(["tunnel", "status"]);
    const start = tunnel.ok && tunnel.value.address ? tunnel.value.address : window.location.origin;
    return {...answer.value, address: `${start}${answer.value.link}`, outside: Boolean(tunnel.ok && tunnel.value.address)};
}

async function previewOpens() {
    const answer = await context.read(["share", "opens", target.value.trim()]);
    refusal.value = answer.ok ? "" : answer.error;
    opens.value = answer.ok ? answer.value.rows : null;
}

if (target.value) previewOpens();

async function make() {
    const answer = await run(["share", "make", target.value.trim(), "--ends", ends.value, ...(password.value ? [`--password=${password.value}`] : []), ...(comments.value ? ["--comments"] : [])]);
    if (!answer.ok) return;
    made.value = await address(answer);
    password.value = "";
    opens.value = null;
}

async function accept(row) {
    const answer = await run(["share", "accept", String(row.id)]);
    if (answer.ok) made.value = await address(answer);
}

async function stopEvery() {
    for (const row of active.value) await run(["share", "revoke", String(row.id)]);
    stoppingAll.value = false;
}

async function toggleComments(row) {
    if (commentRows.value[row.id]) {
        const {[row.id]: _, ...others} = commentRows.value;
        return void (commentRows.value = others);
    }
    const answer = await context.read(["share", "comments", String(row.id)]);
    refusal.value = answer.ok ? "" : answer.error;
    if (answer.ok) commentRows.value = {...commentRows.value, [row.id]: answer.value.rows};
}
</script>

<template>
    <div class="shares">
        <form class="shares-make" data-share-form @submit.prevent="make">
            <input v-model="target" class="shares-target" placeholder="plans:2, docs:12 or reports:4" aria-label="What to share" @change="previewOpens" />
            <div class="shares-option">
                <span class="shares-label">Ends after</span>
                <Segmented :options="ENDS" :value="ends" data-share-ends @pick="ends = $event" />
            </div>
            <div class="shares-option">
                <span class="shares-label">Password</span>
                <input v-model="password" class="shares-password" type="password" autocomplete="new-password" placeholder="None" aria-label="Password" />
                <template v-if="password">
                    <span class="shares-hint">Visitors enter any name and this password.</span>
                </template>
            </div>
            <div class="shares-option">
                <span class="shares-label">Visitors can comment</span>
                <Switch :on="comments" title="Let visitors comment under a name of their own" @change="comments = $event" />
            </div>
            <template v-if="opens">
                <div class="shares-opens" data-share-opens>
                    <span class="shares-label">Whoever has the link can view</span>
                    <template v-for="row in opens" :key="row.id">
                        <span>{{ row.line }}</span>
                    </template>
                </div>
            </template>
            <Btn kind="primary" type="submit" :disabled="!target.trim()">Make a link</Btn>
        </form>
        <template v-if="made">
            <p class="shares-link" data-share-address>{{ made.address }}</p>
            <p class="shares-hint">This link is shown once. Anyone who has it can read it{{ made.expires_at ? ` until ${made.expires_at}` : "" }}.</p>
            <template v-if="!made.outside">
                <p class="shares-hint" data-share-inside>No tunnel is connected, so this address works only from this computer.</p>
            </template>
        </template>
        <template v-if="refusal">
            <p class="shares-failure" role="alert" data-share-refusal>{{ refusal }}</p>
        </template>
        <template v-if="waiting.length">
            <section class="shares-waiting" data-share-waiting>
                <h3 class="shares-label">Needs you</h3>
                <template v-for="row in waiting" :key="row.id">
                    <div class="shares-row" :data-share-row="row.id">
                        <span class="shares-name">An agent asks to share {{ row.row_model }} {{ row.row_id }}, {{ when(row) }}{{ row.locked ? ", with a password" : "" }}{{ row.comments ? ", with comments" : "" }}</span>
                        <Btn small kind="primary" data-share-accept @click="accept(row)">Accept</Btn>
                        <Btn small data-share-deny @click="run(['share', 'deny', String(row.id)])">Deny</Btn>
                    </div>
                </template>
            </section>
        </template>
        <ListTools :tools="tools" />
        <RowList :rows="tools.shown.value" :failure="failure" :loaded="loaded" empty="No link is open" hint="A link you share a row with shows here until you close it." :searching="tools.filtering.value">
            <template #default="{row}">
                <div class="shares-open" :data-share-row="row.id">
                    <div class="shares-row">
                        <span class="shares-name">{{ row.row_model }} {{ row.row_id }}, {{ when(row) }}, {{ row.view_count }} {{ row.view_count === 1 ? "view" : "views" }}{{ row.locked ? ", with a password" : "" }}</span>
                        <template v-if="row.comments">
                            <Btn small data-share-comments-open @click="toggleComments(row)">Comments</Btn>
                        </template>
                        <Btn small data-share-stop @click="run(['share', 'revoke', String(row.id)])">Stop sharing</Btn>
                    </div>
                    <template v-if="commentRows[row.id]">
                        <template v-if="!commentRows[row.id].length">
                            <p class="shares-hint">No comments yet</p>
                        </template>
                        <template v-for="comment in commentRows[row.id]" :key="comment.id">
                            <p class="shares-comment" data-share-comment><strong>{{ comment.visitor_name }}</strong> {{ comment.text }}</p>
                        </template>
                    </template>
                </div>
            </template>
        </RowList>
        <template v-if="active.length > 1">
            <template v-if="stoppingAll">
                <div class="shares-row">
                    <Btn small @click="stoppingAll = false">Keep them</Btn>
                    <Btn small kind="danger" data-share-stop-every-confirm @click="stopEvery">Yes, stop every share</Btn>
                </div>
            </template>
            <template v-else>
                <Btn small data-share-stop-every @click="stoppingAll = true">Stop every share</Btn>
            </template>
        </template>
    </div>
</template>

<style scoped>
.shares {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.shares-make,
.shares-waiting,
.shares-opens,
.shares-open {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    min-width: 0;
}

.shares-make,
.shares-waiting,
.shares-opens {
    align-items: flex-start;
}

.shares-target {
    width: 100%;
    min-width: 0;
}

.shares-option,
.shares-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 12px;
    align-items: center;
}

.shares-label {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
    font-weight: 500;
}

.shares-name {
    flex: 1;
    min-width: 0;
}

.shares-link,
.shares-comment {
    margin: 0;
    overflow-wrap: anywhere;
}

.shares-hint,
.shares-failure {
    margin: 0;
    color: var(--text-2);
}
</style>
