<script setup>
import Icon from "../kit/Icon.vue";
import Spinner from "../kit/Spinner.vue";

defineProps({
    icon: {type: String, required: true},
    name: {type: String, required: true},
    note: {type: String, default: ""},
    busy: {type: Boolean, default: false},
    href: {type: String, default: ""},
    download: {type: String, default: ""},
    waiting: {type: Boolean, default: false},
});
const emit = defineEmits(["press"]);
</script>

<template>
    <component
        :is="href ? 'a' : waiting ? 'div' : 'button'"
        :type="href || waiting ? undefined : 'button'"
        :href="href || undefined"
        :download="href ? download : undefined"
        :aria-busy="waiting || undefined"
        :disabled="busy || undefined"
        :class="['share-row', {waiting}]"
        @click="!href && !waiting && emit('press')"
    >
        <Icon :name="icon" :size="20" />
        <span class="share-words">
            <span class="share-name">{{ name }}</span>
            <template v-if="note">
                <span class="share-note">{{ note }}</span>
            </template>
        </span>
        <template v-if="busy || waiting">
            <Spinner />
        </template>
    </component>
</template>

<style scoped>
.share-row {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    min-height: 56px;
    padding: 8px 16px;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    text-align: left;
    text-decoration: none;
}

.share-row.waiting {
    color: var(--text-3);
}

.share-words {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
}

.share-name {
    color: var(--text);
    font-weight: 600;
}

.share-note {
    overflow: hidden;
    color: var(--text-2);
    font-size: 0.765rem;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
