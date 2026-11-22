<script setup lang="ts">
/**
 * The title and subline of a ListRow, one above the other and filling the room between the lead and the trail. The
 * title is one line that ends in an ellipsis, and --text-3 when dim. The subline is one line of --text-small --text-3
 * and is left out when the slot is.
 */
withDefaults(defineProps<{ dim?: boolean }>(), { dim: false });
</script>

<template>
    <span class="flex min-w-0 flex-1 flex-col">
        <span class="truncate" :class="dim ? 'text-text-3' : 'text-text'">
            <slot name="title" />
        </span>
        <span v-if="$slots.subline" class="truncate text-small text-text-3">
            <slot name="subline" />
        </span>
    </span>
</template>
