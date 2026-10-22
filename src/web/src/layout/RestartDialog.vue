<script setup>
import {computed, onUnmounted, watch} from "vue";
import Dialog from "../kit/Dialog.vue";
import {open} from "../domain/records.js";
import {restartNotice} from "../domain/notices.js";
import {refresh} from "../sync/rows.js";

// While the dialog stands, the notices are read again every few seconds, so it goes the moment the journal closes the
// notice, even when the change is lost among a flood of others the page is catching up on.
const RECHECK_MS = 3000;

const notice = computed(() => restartNotice(open("notices")));
let timer = 0;
watch(
    () => Boolean(notice.value),
    (shown) => {
        clearInterval(timer);
        timer = shown ? setInterval(() => refresh(["notices"]), RECHECK_MS) : 0;
    },
    {immediate: true}
);
onUnmounted(() => clearInterval(timer));
</script>

<template>
    <template v-if="notice">
        <Dialog modal small :closable="false" :title="notice.title">
            <p class="restart-text">
                The latest install changed the journal's hooks and skills, which reach the agent only in a new session. Quit the agent
                in its terminal, or stop its process, and start it again. This closes by itself once the agent has started.
            </p>
        </Dialog>
    </template>
</template>

<style scoped>
.restart-text {
    margin: 0;
    line-height: 1.5;
    color: var(--text-2);
}
</style>
