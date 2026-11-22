<script setup lang="ts">
import Dialog from '@/components/kit/Dialog.vue';
import Kbd from '@/components/kit/Kbd.vue';
import { useShellOverlays } from '@/composables/useShellOverlays';
import { shortcutGroups } from './shortcuts';

/**
 * The keyboard help, a modal dialog over the page: every shortcut the app has, in groups, each with its keys in Kbd.
 * It scrolls inside the dialog so a phone keeps its footer reachable, traps the focus, and Escape closes it and gives
 * the focus back to what opened it.
 */
const { isHelpOpen } = useShellOverlays();
</script>

<template>
    <Dialog :open="isHelpOpen" title="Keyboard shortcuts" size="md" @close="isHelpOpen = false">
        <div class="flex max-h-[60dvh] flex-col gap-4 overflow-y-auto">
            <template v-for="group in shortcutGroups" :key="group.title">
                <section :aria-label="group.title" class="flex flex-col gap-1.5">
                    <h3 class="text-group font-semibold tracking-[.06em] text-text-3 uppercase">{{ group.title }}</h3>
                    <ul class="m-0 flex list-none flex-col gap-1 p-0">
                        <template v-for="shortcut in group.shortcuts" :key="shortcut.does">
                            <li class="flex items-center justify-between gap-3 text-small text-text-2">
                                <span class="min-w-0">{{ shortcut.does }}</span>
                                <span class="flex shrink-0 items-center gap-1">
                                    <template v-for="key in shortcut.keys" :key="key">
                                        <Kbd>{{ key }}</Kbd>
                                    </template>
                                </span>
                            </li>
                        </template>
                    </ul>
                </section>
            </template>
        </div>
    </Dialog>
</template>
