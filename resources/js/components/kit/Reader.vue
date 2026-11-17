<script setup lang="ts">
/**
 * The reader of a chosen row (doc 4, 7.1): a meta line, the title with its buttons, an abstract, then the body.
 */
defineProps<{ title: string; abstract?: string }>();
</script>

<template>
    <article class="flex flex-col">
        <header class="border-b border-border px-4 pt-3.5 pb-3">
            <div
                class="flex min-h-[18px] items-center gap-2 text-small text-text-3"
            >
                <slot name="meta" />
            </div>
            <div class="mt-1 flex items-start gap-3">
                <h2
                    class="mt-1.5 flex-1 text-reader leading-[1.3] font-semibold tracking-[-0.01em] text-text"
                >
                    {{ title }}
                </h2>
                <div class="flex items-center gap-2">
                    <slot name="actions" />
                </div>
            </div>
            <template v-if="abstract">
                <p class="mt-1 text-field text-text-3">{{ abstract }}</p>
            </template>
        </header>
        <div class="px-4 pb-6"><slot /></div>
    </article>
</template>
