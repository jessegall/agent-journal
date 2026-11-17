<script setup lang="ts">
/**
 * The list-and-reader frame of the domain pages (doc 4, 7.1): a top slot, then a fixed-width list beside a reader that
 * scrolls alone. In a narrow container the list and reader stack.
 */
withDefaults(defineProps<{ listWidth?: number }>(), { listWidth: 460 });
</script>

<template>
    <div class="@container flex h-full min-h-0 flex-col">
        <slot name="top" />
        <div class="flex min-h-40 flex-1 flex-col @2xl:flex-row">
            <section
                class="max-h-[45%] shrink-0 overflow-y-auto border-b border-border @2xl:max-h-none @2xl:w-(--list-width) @2xl:border-r @2xl:border-b-0"
                :style="{ '--list-width': `min(${listWidth}px, 50%)` }"
            >
                <slot name="list" />
            </section>
            <section class="min-w-0 flex-1 overflow-y-auto">
                <slot name="reader" />
            </section>
        </div>
    </div>
</template>
