<script setup>
import Btn from "../kit/Btn.vue";
import CopyButton from "../kit/CopyButton.vue";
import EmptyState from "../kit/EmptyState.vue";
import Icon from "../kit/Icon.vue";
import {endsOf, linkMessage, locked, viewsOf} from "../composables/shares.js";

defineProps({
    waiting: {type: Array, required: true},
    open: {type: Array, required: true},
    kind: {type: String, required: true},
    title: {type: String, default: ""},
    stopping: {type: Number, default: 0},
});
const emit = defineEmits(["approve", "stop"]);
</script>

<template>
    <template v-if="!open.length && !waiting.length">
        <EmptyState title="No open links">Links you make to this {{ kind }} show here until they end.</EmptyState>
    </template>
    <div class="open-shares">
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
                <Btn small kind="primary" :busy="stopping === share.n" @click="emit('approve', share)">Accept</Btn>
                <Btn small @click="emit('stop', share)">Deny</Btn>
            </div>
        </template>
        <template v-for="share in open" :key="share.n">
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
                <CopyButton :text="linkMessage(title, share.abstract)" icon="chat" hint="Copy the link with a short description" />
                <Btn small kind="danger" :busy="stopping === share.n" @click="emit('stop', share)">Stop sharing</Btn>
            </div>
        </template>
    </div>
</template>

<style scoped>
.open-shares {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 10px;
    min-height: 0;
    overflow-y: auto;
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

.quiet,
.meta {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}
</style>
