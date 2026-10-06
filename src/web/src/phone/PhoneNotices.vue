<script setup>
import {computed, ref} from "vue";
import Icon from "../kit/Icon.vue";

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
const said = (notice) => `${TONE_WORDS[tone(notice)]}${notice.title}${notice.data?.label ? `. ${notice.data.label}` : ""}`;
</script>

<template>
    <template v-if="notices.length">
        <div class="notices" role="region" aria-label="Pinned notices">
            <template v-for="notice in listed" :key="notice.n">
                <div :class="['notice', tone(notice)]">
                    <button type="button" class="notice-open" :aria-label="said(notice)" @click="emit('open', notice)">
                        <span class="notice-mark" aria-hidden="true" />
                        <span class="notice-title">{{ notice.title }}</span>
                        <template v-if="notice.data?.label">
                            <span class="notice-label">{{ notice.data.label }}</span>
                        </template>
                    </button>
                    <button type="button" class="notice-close" :aria-label="`Close notice: ${notice.title}`" @click="emit('close', notice)">
                        <Icon name="close" :size="14" />
                    </button>
                </div>
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

.notice {
    display: flex;
    align-items: center;
    min-height: 44px;
    border: 1px solid var(--border-2);
    border-radius: 14px;
    background: var(--raised);
}

.notice-open {
    display: flex;
    flex: 1;
    align-items: center;
    gap: 10px;
    min-width: 0;
    min-height: 44px;
    padding: 0 4px 0 14px;
    border: 0;
    background: none;
    color: var(--text);
    font: inherit;
    font-size: 0.882rem;
    text-align: left;
}

.notice-mark {
    flex: none;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent);
}

.good .notice-mark {
    background: var(--tone-good);
}

.warn .notice-mark {
    background: var(--tone-warn);
}

.danger .notice-mark {
    background: var(--danger);
}

.notice-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.notice-label {
    flex: none;
    color: var(--accent-text);
    font-weight: 600;
}

.notice-close {
    display: flex;
    flex: none;
    margin-left: 10px;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-2);
}
</style>
