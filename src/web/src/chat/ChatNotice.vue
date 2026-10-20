<script setup>
import Btn from "../kit/Btn.vue";
import CloseButton from "../kit/CloseButton.vue";
import Notice from "../kit/Notice.vue";
import {onMounted, ref} from "vue";
import {useScope} from "../composables/scope.js";
import {isRef, peekRef} from "../route.js";
import {startMigration} from "../composables/migration.js";

const props = defineProps({notice: Object, fixed: Boolean});
const emit = defineEmits(["closing"]);
const MIGRATION = "migration";

const scope = useScope();
const working = ref(false);
const failure = ref("");

async function bringAcross() {
    if (working.value) return;
    working.value = true;
    failure.value = "";
    try {
        await startMigration();
    } catch (e) {
        failure.value = e.message;
    } finally {
        working.value = false;
    }
}

const ARMED_AFTER = 1500;
const armed = ref(false);
onMounted(() => setTimeout(() => (armed.value = true), ARMED_AFTER));

function close() {
    if (!armed.value) return;
    const request = scope.api.act("notices", props.notice.id, "close");
    request.catch(() => {});
    emit("closing", props.notice.id, request);
}
</script>

<template>
    <div :class="['chat-notice', `tone-${notice.tone || 'note'}`]">
        <span class="chat-notice-dot" />
        <span class="chat-notice-text">{{ notice.title }}</span>
        <template v-if="notice.link === MIGRATION">
            <Btn small :busy="working" @click="bringAcross">Copy into version 4</Btn>
        </template>
        <template v-else-if="notice.link && isRef(notice.link)">
            <button type="button" class="chat-notice-go" @click="peekRef(notice.link)">{{ notice.label || "open" }}</button>
        </template>
        <template v-else-if="notice.link">
            <a class="chat-notice-go" :href="notice.link" target="_blank" rel="noopener">{{ notice.label || "open" }}</a>
        </template>
        <template v-if="!fixed">
            <CloseButton :class="{unarmed: !armed}" title="Close this" @click="close" />
        </template>
        <template v-if="failure">
            <Notice role="alert" class="chat-notice-error">{{ failure }}</Notice>
        </template>
    </div>
</template>

<style scoped>
.unarmed {
    pointer-events: none;
}

.chat-notice {
    --tone: #4fc3d7;

    flex: none;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    min-height: 30px;
    padding: 3px 8px 3px 10px;
    border-bottom: 1px solid var(--border);
    border-left: 3px solid var(--tone);
    background: color-mix(in srgb, var(--tone) 14%, var(--bg));
    color: var(--text);
    font-size: 11.5px;
    line-height: 16px;
}

.chat-notice-dot {
    flex: none;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--tone);
}

.chat-notice-text {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.chat-notice-error {
    flex-basis: 100%;
    color: var(--danger);
}

.chat-notice :deep(.btn.small) {
    height: 22px;
    padding: 0 8px;
    font-size: 11px;
}

.chat-notice-go {
    flex: none;
    cursor: pointer;
    font-family: inherit;
    padding: 1px 8px;
    border: 1px solid color-mix(in srgb, var(--tone) 55%, transparent);
    border-radius: 5px;
    background: color-mix(in srgb, var(--tone) 22%, transparent);
    color: var(--text);
    font-size: 11px;
}

.chat-notice-go:hover {
    background: color-mix(in srgb, var(--tone) 38%, transparent);
    color: #fff;
}

.chat-notice-x .ico {
    width: 11px;
    height: 11px;
}

.chat-notice.tone-good {
    --tone: var(--tone-good);
}

.chat-notice.tone-warn {
    --tone: var(--tone-warn);
}
</style>
