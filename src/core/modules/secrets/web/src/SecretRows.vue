<script setup>
import {computed, ref} from "vue";
import {Btn, Dialog, EmptyState, Icon, removed, useWindow} from "@journal/window-kit";
import SecretCard from "./SecretCard.vue";
import SecretDialog from "./SecretDialog.vue";
import SecretNewDialog from "./SecretNewDialog.vue";

// the Secrets page holds no field: what waits on the person is one button each, a saved secret is one card each, and all change happens in a centred dialog
const view = useWindow();
const {rows, data, failure, loaded, act} = view.props.secrets;
const deleted = computed(() => data.value?.deleted ?? []);
const openId = ref(0);
const isMaking = ref(false);
const removing = ref(null);
const asked = computed(() => rows.value.filter((row) => row.waiting));
const saved = computed(() => rows.value.filter((row) => !row.waiting));
const opened = computed(() => rows.value.find((row) => row.id === openId.value) ?? null);
const count = computed(() => (rows.value.length === 1 ? "1 secret" : rows.value.length ? `${rows.value.length} secrets` : "No secrets"));

async function remove() {
    const row = removing.value;
    removing.value = null;
    await act(["secret", "delete", String(row.id)], removed(row.id));
}

async function restore(row) {
    await act(["secret", "restore", String(row.id)]);
}
</script>

<template>
    <section class="secrets">
        <div class="bar">
            <span class="count" data-secret-count>{{ count }}</span>
            <Btn variant="primary" data-secret-new @click="isMaking = true"><Icon name="plus" :size="12" />New secret</Btn>
        </div>
        <div class="body">
            <p class="lead">Secrets let the agent use keys and logins without seeing them. Add your credentials here. Saved credentials stay hidden and are stored in a file outside the project.</p>
            <template v-if="failure">
                <p class="failure" role="alert">{{ failure }}</p>
            </template>
            <template v-if="asked.length">
                <div class="tiles" data-secret-asks>
                    <template v-for="row in asked" :key="row.id">
                        <button type="button" class="ask" :data-secret-ask="row.id" @click="openId = row.id">
                            <Icon :name="row.secret_type === 'login' ? 'lock' : 'key'" :size="18" />
                            <span class="names">
                                <span class="ask-title">{{ row.title }}</span>
                                <span class="ask-line">Add credentials</span>
                            </span>
                        </button>
                    </template>
                </div>
            </template>
            <template v-if="saved.length">
                <section class="group">
                    <h3>Saved secrets</h3>
                    <div class="tiles cards">
                        <template v-for="row in saved" :key="row.id">
                            <SecretCard :row="row" @update="openId = row.id" @delete="removing = row" />
                        </template>
                    </div>
                </section>
            </template>
            <template v-else-if="!asked.length && !failure">
                <EmptyState :loading="!loaded" title="No secrets yet">Add a key or login to get started. Only its name will appear here.</EmptyState>
            </template>
            <template v-if="deleted.length">
                <section class="group">
                    <h3>Deleted secrets</h3>
                    <div class="deleted">
                        <template v-for="row in deleted" :key="row.id">
                            <p class="deleted-row" data-secret-removed>
                                <span><b>{{ row.title }}</b> was deleted.</span>
                                <Btn small bordered data-secret-restore @click="restore(row)">Restore</Btn>
                            </p>
                        </template>
                    </div>
                </section>
            </template>
        </div>
        <template v-if="opened">
            <SecretDialog :key="opened.id" :row="opened" :run="act" @close="openId = 0" />
        </template>
        <template v-if="isMaking">
            <SecretNewDialog :run="act" @close="isMaking = false" />
        </template>
        <template v-if="removing">
            <Dialog padded :title="`Delete ${removing.title}`" fits @close="removing = null">
                <p class="lead">Deleting this secret stops the agent from using it. You can restore it from Deleted secrets.</p>
                <template #foot>
                    <Btn @click="removing = null">Cancel</Btn>
                    <Btn variant="danger" data-secret-confirm @click="remove">Delete secret</Btn>
                </template>
            </Dialog>
        </template>
    </section>
</template>

<style scoped>
.secrets {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    container-type: inline-size;
}

.bar {
    display: flex;
    flex: none;
    align-items: center;
    gap: 10px;
    min-height: 45px;
    padding: 8px 14px 8px 22px;
    box-sizing: border-box;
    border-bottom: 1px solid var(--border);
}

.count {
    flex: 1;
    color: var(--text-2);
    font-size: 12.5px;
    font-weight: 500;
}

.body {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 16px;
    min-height: 0;
    padding: 22px 24px 40px;
    overflow-y: auto;
    box-sizing: border-box;
}

.lead {
    max-width: 640px;
    margin: 0;
    color: var(--text-3);
    font-size: 12.5px;
    line-height: 1.55;
}

.failure {
    margin: 0;
    color: var(--danger);
    font-size: 12.5px;
}

.tiles {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 12px;
}

/* one row height for all, so every card stands as tall as the tallest */
.cards {
    grid-auto-rows: 1fr;
    gap: 16px;
}

.ask {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    padding: 12px 14px;
    border: 1px solid var(--accent);
    border-radius: 12px;
    background: var(--accent-dim);
    color: var(--accent-text);
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.ask:hover {
    background: color-mix(in srgb, var(--accent) 30%, var(--accent-dim));
}

.names {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.ask-title {
    overflow: hidden;
    color: var(--text);
    font-size: 14.5px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.ask-line {
    color: var(--text-2);
    font-size: 12px;
    line-height: 1.4;
}

.group {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 0;
}

h3 {
    margin: 0;
    color: var(--text-2);
    font-size: 14px;
    font-weight: 500;
}

.deleted {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--border);
    border-radius: 10px;
}

.deleted-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0;
    padding: 7px 8px 7px 14px;
    color: var(--text-3);
    font-size: 12.5px;
}

.deleted-row span {
    flex: 1;
}

.deleted-row b {
    color: var(--text-2);
    font-weight: 500;
}

@container (max-width: 640px) {
    .bar {
        padding: 8px 12px 8px 16px;
    }

    .body {
        padding: 16px 16px 32px;
    }

    .tiles {
        grid-template-columns: minmax(0, 1fr);
    }
}
</style>
