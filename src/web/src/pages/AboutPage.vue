<script setup>
import {onMounted} from "vue";
import {useUpdates} from "../composables/updates.js";
import Btn from "../kit/Btn.vue";
import Notice from "../kit/Notice.vue";
import StateDot from "../kit/StateDot.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import {locked} from "../state/updating.js";

const {about, changed, releases, error, status, loadMore, update, start} = useUpdates();

onMounted(start);
</script>

<template>
    <section class="about">
        <template v-if="error">
            <p class="error">{{ error }}</p>
        </template>
        <template v-if="about">
            <p class="version">Agent journal {{ about.version }}</p>
            <template v-if="status">
                <div class="update-line">
                    <template v-if="status.busy">
                        <StateDot state="running" />
                    </template>
                    <span>{{ status.text }}</span>
                    <template v-if="status.update && !changed.length">
                        <Btn kind="primary" :busy="locked()" @click="update()">Update to {{ about.latest }}</Btn>
                    </template>
                </div>
                <template v-if="status.update && changed.length">
                    <Notice tone="need" class="changed-files">
                        These files changed since the journal wrote them: {{ changed.join(", ") }}. Updating copies them into .journal/attic first.
                        <template #actions>
                            <Btn kind="primary" @click="update(true)">Update anyway</Btn>
                        </template>
                    </Notice>
                </template>
            </template>
            <template v-if="releases.length">
                <details class="earlier">
                    <summary>Install an earlier version</summary>
                    <p class="hint">The journal copies your record to .journal/attic first, then installs the version you pick.</p>
                    <template v-for="found in releases" :key="found">
                        <div class="release">
                            <span>Version {{ found }}</span>
                            <Btn small @click="update(true, found)">Install {{ found }}</Btn>
                        </div>
                    </template>
                </details>
            </template>
            <TextDisplay class="changelog" :text="about.changelog" />
            <template v-if="about.more">
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
