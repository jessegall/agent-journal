<script setup lang="ts">
import Button from './Button.vue';
import Icon from './Icon.vue';

/**
 * The list-and-reader frame of the domain pages (doc 4, 7.1): a top slot, then a fixed-width list beside a reader that
 * scrolls alone. In a narrow container the list and reader stack, or, when the page says which one it shows, only that
 * one is shown: the reader then has a visible Back to the list.
 */
withDefaults(
    defineProps<{
        listWidth?: number;
        narrowShows?: 'both' | 'list' | 'reader';
        back?: { href: string; label: string };
    }>(),
    { listWidth: 460, narrowShows: 'both', back: undefined },
);
</script>

<template>
    <div class="@container flex h-full min-h-0 flex-col">
        <slot name="top" />
        <div class="flex min-h-40 flex-1 flex-col @2xl:flex-row">
            <section
                class="shrink-0 overflow-y-auto border-border @2xl:block @2xl:max-h-none @2xl:w-(--list-width) @2xl:border-r @2xl:border-b-0"
                :class="{
                    'max-h-[45%] border-b': narrowShows === 'both',
                    hidden: narrowShows === 'reader',
                    '@max-2xl:flex-1': narrowShows === 'list',
                }"
                :style="{ '--list-width': `min(${listWidth}px, 50%)` }"
            >
                <slot name="list" />
            </section>
            <section
                class="min-w-0 flex-1 overflow-y-auto @2xl:block"
                :class="{ hidden: narrowShows === 'list' }"
            >
                <template v-if="back && narrowShows === 'reader'">
                    <div class="px-3 pt-3 @2xl:hidden">
                        <Button :href="back.href" size="small" preserve-scroll>
                            <Icon name="arrow" :size="12" class="rotate-180" />
                            <span>{{ back.label }}</span>
                        </Button>
                    </div>
                </template>
                <slot name="reader" />
            </section>
        </div>
    </div>
</template>
