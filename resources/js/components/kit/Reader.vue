<script setup lang="ts">
/**
 * The reader of a chosen row: a meta line when it has one, the title with its buttons, an abstract, then the body,
 * padded 18 by 22 and at most 760 wide as the design draws it, with no rule between the head and the body.
 */
defineProps<{ title: string; abstract?: string }>();
</script>

<template>
    <article data-reader class="flex max-w-190 flex-col">
        <header class="px-5.5 pt-4.5">
            <template v-if="$slots.meta">
                <div
                    class="mb-1 flex min-h-[18px] items-center gap-2 text-badge text-text-3"
                >
                    <slot name="meta" />
                </div>
            </template>
            <div class="flex items-start gap-3">
                <h2 class="flex-1 text-title font-semibold text-text">
                    {{ title }}
                </h2>
                <div class="flex items-center gap-2">
                    <slot name="actions" />
                </div>
            </div>
            <template v-if="abstract">
                <p class="mt-1 text-body text-text-2">{{ abstract }}</p>
            </template>
        </header>
        <div class="px-5.5 pb-4.5"><slot /></div>
    </article>
</template>
