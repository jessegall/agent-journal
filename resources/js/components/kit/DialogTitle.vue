<script setup lang="ts">
import { inject } from 'vue';
import { dialogTitleIdKey } from './dialogTitleId';

/**
 * The title of a Dialog: one line of --text-body text in weight 600 that takes the free width of the header and ends in
 * an ellipsis. Its id is the one the Dialog names itself from with aria-labelledby.
 */
const id = inject(dialogTitleIdKey, undefined);
</script>

<template>
    <h2 :id="id" class="m-0 min-w-0 flex-1 truncate text-body font-semibold text-text">
        <slot />
    </h2>
</template>
