<script setup>
import {computed, ref} from "vue";
import Icon from "../kit/Icon.vue";
import DockRow from "./kit/DockRow.vue";

const props = defineProps({notices: {type: Array, required: true}});
const emit = defineEmits(["open", "close"]);
const ALL_UP_TO = 2;
const opened = ref(false);
const newestFirst = computed(() => [...props.notices].sort((a, b) => (b.created || 0) - (a.created || 0)));
const folded = computed(() => props.notices.length > ALL_UP_TO && !opened.value);
const listed = computed(() => (folded.value ? newestFirst.value.slice(0, 1) : newestFirst.value));
const TONES = ["good", "warn", "danger"];
const TONE_WORDS = {good: "Done: ", warn: "Warning: ", danger: "Problem: ", plain: ""};
const tone = (notice) => (TONES.includes(notice.data?.tone) ? notice.data.tone : "plain");
const spokenLabel = (notice) => `${TONE_WORDS[tone(notice)]}${notice.title}${notice.data?.label ? `. ${notice.data.label}` : ""}`;
</script>

<template>
    <template v-if="notices.length">
        <div class="notices" role="region" aria-label="Pinned notices">
            <template v-for="notice in listed" :key="notice.n">
                <DockRow
                    :title="notice.title"
                    :label="notice.data?.label || ''"
                    :tone="tone(notice)"
                    :spoken="spokenLabel(notice)"
                    :close-label="`Close notice: ${notice.title}`"
                    @open="emit('open', notice)"
                    @close="emit('close', notice)"
                />
            </template>
            <template v-if="notices.length > ALL_UP_TO">
                <button type="button" class="notices-fold" :aria-expanded="opened" @click="opened = !opened">
                    <span class="notices-count">{{ opened ? "Show fewer" : `+${notices.length - 1} more` }}</span>
                    <Icon name="chevronRight" bold :facing="opened ? 'down' : 'up'" :size="14" />
                </button>
            </template>
        </div>
    </template>
</template>

<style scoped>
.notices {
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-height: 40vh;
    overflow-y: auto;
    overscroll-behavior: contain;
}

.notices-fold {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 44px;
    padding: 0 14px;
    border: 1px solid var(--border-2);
    border-radius: 14px;
    background: var(--raised);
    color: var(--text);
    font: inherit;
    font-size: 0.882rem;
    font-weight: 600;
}
</style>
