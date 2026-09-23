<script setup>
import {computed, ref} from "vue";
import DiffCard from "../kit/DiffCard.vue";
import EmptyState from "../kit/EmptyState.vue";
import JumpPill from "../kit/JumpPill.vue";
import {useFileFeed} from "../composables/fileFeed.js";
import {useFollow} from "../composables/follow.js";
import {useNow} from "../composables/now.js";
import {fresh} from "../format/time.js";

const props = defineProps({agent: {type: Number, required: true}});

const scroller = ref(null);
const follow = useFollow(scroller);
const {following, unseen, jump, scrolled, wheeled} = follow;
const {cards, ready, latest} = useFileFeed(props.agent, follow);
const now = useNow();
const empty = computed(() => ready.value && !cards.value.length);
</script>

<template>
    <div class="file-feed">
        <div ref="scroller" class="file-feed-scroll" @scroll.passive="scrolled" @wheel.passive="wheeled">
            <div class="file-feed-flow">
                <template v-for="c in cards" :key="c.id">
                    <DiffCard
                        :path="c.path"
                        :kind="c.kind"
                        :added="c.added"
                        :removed="c.removed"
                        :ago="fresh(c.at, now)"
                        :rows="c.rows"
                        :half="c.half"
                        :entering="c.id === latest"
                        :fresh="latest"
                    />
                </template>
            </div>
        </div>
        <template v-if="empty">
            <EmptyState title="No edits yet">The agent's file edits appear here as it makes them.</EmptyState>
        </template>
        <template v-if="!following && cards.length">
            <JumpPill :count="unseen" @jump="jump" />
        </template>
    </div>
</template>

<style scoped>
.file-feed {
    position: absolute;
    inset: 0;
    container-type: inline-size;
}

.file-feed-scroll {
    position: absolute;
    inset: 0;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--border-3) transparent;
}

.file-feed-flow {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 10px;
    padding: 16px 0;
}
</style>
