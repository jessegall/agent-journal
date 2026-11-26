<script setup lang="ts">
import Button from './Button.vue';
import Icon from './Icon.vue';

/**
 * The list-and-reader frame of the domain pages: a top slot, then a list beside a reader that scrolls alone. In a
 * narrow container they stack, or only the one the page names shows, with a Back to the list; the reader's column is
 * 760 px, 720 px for settings, or full.
 */
withDefaults(
    defineProps<{
        listWidth?: number;
        narrowShows?: 'both' | 'list' | 'reader';
        back?: { href: string; label: string };
        readerWidth?: 'standard' | 'settings' | 'unrestricted';
    }>(),
    { listWidth: 460, narrowShows: 'both', back: undefined, readerWidth: 'unrestricted' },
);
</script>

<template>
    <div class="@container flex h-full min-h-0 flex-col">
        <slot name="top" />
        <div class="flex min-h-40 flex-1 flex-col @2xl:flex-row">
            <section
                scroll-region
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
                scroll-region
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
                <div
                    :class="{
                        'max-w-190': readerWidth === 'standard',
                        'max-w-180': readerWidth === 'settings',
                    }"
                >
                    <slot name="reader" />
                </div>
            </section>
        </div>
    </div>
</template>
