<script setup>
import {onMounted} from "vue";
import {store} from "../state/store.js";
import {useUpdates} from "../composables/updates.js";
import Btn from "../kit/Btn.vue";
import Skeleton from "../kit/Skeleton.vue";
import StateDot from "../kit/StateDot.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import {locked} from "../state/updating.js";

const {about, error, status, loadMore, update, forceUpdate, start} = useUpdates();

onMounted(start);
</script>

<template>
    <section class="about">
        <template v-if="error">
            <p class="error">{{ error }}</p>
        </template>
        <template v-if="!about && !error">
            <Skeleton shape="page" :count="3" label="Loading the version and the changelog" />
        </template>
        <template v-if="about">
            <p class="version">Agent journal {{ about.installed }}</p>
            <template v-if="about.branch">
                <p class="hint">This journal follows the branch {{ about.branch }}, set under Settings, Updates: it installs that branch's newest commit instead of a release.</p>
            </template>
            <template v-if="status">
                <div class="update-line">
                    <template v-if="status.busy">
                        <StateDot state="running" />
                    </template>
                    <span>{{ status.text }}</span>
                    <template v-if="status.update">
                        <Btn kind="primary" :busy="locked()" @click="update()">Update to {{ about.latest }}</Btn>
                    </template>
                </div>
            </template>
            <div class="force-line">
                <span class="hint">Or try this route instead: it installs the latest release straight from GitHub.</span>
                <Btn class="force-update" :busy="locked()" @click="forceUpdate()">Install the latest release with the README command</Btn>
            </div>
            <TextDisplay class="changelog" :text="about.changelog" />
            <template v-if="!about.is_last_page">
                <Btn class="more-releases" @click="loadMore()">Show older releases</Btn>
            </template>
        </template>
    </section>
</template>

<style scoped>
.about {
    padding: 16px 20px;
    max-width: 760px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.version {
    font-weight: 600;
}

.update-line {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text-2);
    font-size: 13px;
}

.force-line {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
    font-size: 13px;
}

.update-line .btn {
    margin-left: auto;
}

.release {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 4px 0;
}

.more-releases {
    align-self: flex-start;
}

.hint {
    color: var(--text-2);
}

.earlier summary {
    cursor: pointer;
    font-weight: 600;
}

.error {
    color: var(--danger);
}
</style>
