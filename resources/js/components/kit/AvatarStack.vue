<script setup lang="ts">
import { computed } from 'vue';
import Avatar from './Avatar.vue';
import Chip from './Chip.vue';
import type { Participant } from './participant';

/**
 * A group's members as large avatars overlapping by 7 px, each with a 2 px --bg ring. Past `max` (default 4) the
 * rest fold into a small "+N" chip.
 */
const props = withDefaults(defineProps<{ members: readonly Participant[]; max?: number; label?: string }>(), {
    max: 4,
    label: undefined,
});

const shown = computed(() => props.members.slice(0, props.max));
const hidden = computed(() => props.members.length - shown.value.length);
</script>

<template>
    <span role="group" :aria-label="label ?? `${members.length} members`" class="inline-flex items-center">
        <template v-for="(member, at) in shown" :key="at">
            <Avatar
                :participant="member"
                size="lg"
                class="ring-2 ring-bg not-first:-ml-1.75"
            />
        </template>
        <template v-if="hidden > 0">
            <Chip class="-ml-1.75 ring-2 ring-bg">+{{ hidden }}</Chip>
        </template>
    </span>
</template>
