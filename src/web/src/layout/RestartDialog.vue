<script setup>
import {computed} from "vue";
import Dialog from "../kit/Dialog.vue";
import {open} from "../domain/records.js";
import {restartNotice} from "../domain/notices.js";

const notice = computed(() => restartNotice(open("notices")));
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
