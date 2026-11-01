<script setup>
import {ref} from "vue";
import {RowList, useRows} from "@journal/window-kit";

const releases = useRows("release list", ["release.*"]);
const standing = ref(null);
const checkFailure = ref("");

async function check() {
    const result = await releases.context.read("update check");
    standing.value = result.ok ? result.value : null;
    checkFailure.value = result.ok ? "" : result.error;
}

async function install() {
    const result = await releases.act(["update", "install"]);
    if (result.ok) await check();
}

check();
</script>

<template>
    <template v-if="checkFailure || releases.actionFailure.value">
        <p class="failure">{{ checkFailure || releases.actionFailure.value }}</p>
    </template>
    <div class="standing">
        <span class="line">{{ standing ? standing.line : "Checking for a newer release" }}</span>
        <button type="button" @click="check">Check again</button>
        <template v-if="standing && !standing.is_current">
            <button type="button" @click="install">Install</button>
        </template>
    </div>
    <h3 class="heading">Installed releases</h3>
    <RowList :rows="releases.rows.value" :failure="releases.failure.value" :loaded="releases.loaded.value" empty="No release installed from here yet">
        <template #default="{row}">
            <div class="release" :data-row="row.id">
                <span class="title">{{ row.tag || row.checksum.slice(0, 12) }}</span>
                <span class="detail">{{ new Date(row.created_at).toLocaleString() }}</span>
            </div>
        </template>
    </RowList>
</template>

<style scoped>
.failure {
    margin: 0 0 8px;
    color: var(--bad, var(--text-2));
    font-size: 12px;
}

.standing,
.release {
    display: flex;
    align-items: baseline;
    gap: 10px;
    font-size: 13px;
}

.line,
.title {
    flex: 1;
}

.heading {
    margin: 12px 0 6px;
    color: var(--text-3);
    font-size: 12px;
    font-weight: 600;
}

.detail {
    color: var(--text-3);
    font-size: 12px;
}

button {
    padding: 2px 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--surface);
    color: inherit;
    font-size: 12px;
    cursor: pointer;
}
</style>
