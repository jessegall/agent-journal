<script setup lang="ts">
import { onBeforeUnmount, onMounted, provide, useId, useTemplateRef } from 'vue';
import PanelBody from './PanelBody.vue';
import PanelHeader from './PanelHeader.vue';
import { panelTitleIdKey } from './panelTitleId';

/**
 * Something that belongs to the page beside it, open over it and not modal: a PanelHeader (the leading slot, title,
 * count and a close button) over a scrolling PanelBody (the default slot), in a --raised box with a --border-2 border,
 * radius --radius-card and --shadow-pop. The chat placement sits at top 8, right 4 and bottom 8 and is 380 wide at
 * most; the side placement fills the height of its container at its right edge. It is a role dialog named by its
 * title. It opens with the focus on its close button, Escape closes it from anywhere inside, fields included, and the
 * focus returns to what had it before it opened. It slides in from 24px over 240ms with its opacity and leaves over
 * 180ms, and without motion under reduced motion.
 */
withDefaults(
    defineProps<{ title: string; count?: number; closeLabel?: string; placement?: 'chat' | 'side' }>(),
    { count: undefined, closeLabel: 'Close', placement: 'chat' },
);

const emit = defineEmits<{ close: [] }>();

const titleId = `panel-title-${useId()}`;
const panel = useTemplateRef<HTMLElement>('panel');
const opener = document.activeElement as HTMLElement | null;

provide(panelTitleIdKey, titleId);

onMounted(() => panel.value?.querySelector<HTMLElement>('[data-panel-close]')?.focus());
onBeforeUnmount(() => opener?.focus());
</script>

<template>
    <Transition
        appear
        enter-active-class="transition duration-(--duration-panel) ease-journal motion-reduce:transition-none"
        enter-from-class="translate-x-6 opacity-0 motion-reduce:translate-x-0 motion-reduce:opacity-100"
        leave-active-class="transition duration-(--duration-pop) ease-journal motion-reduce:transition-none"
        leave-to-class="translate-x-6 opacity-0 motion-reduce:translate-x-0 motion-reduce:opacity-100"
    >
        <section
            ref="panel"
            role="dialog"
            :aria-labelledby="titleId"
            class="absolute flex flex-col overflow-hidden rounded-card border border-border-2 bg-raised shadow-pop"
            :class="
                placement === 'chat'
                    ? 'top-2 right-1 bottom-2 w-[min(380px,calc(100%-8px))]'
                    : 'top-0 right-0 bottom-0 w-[min(380px,100%)]'
            "
            @keydown.escape.stop="emit('close')"
        >
            <PanelHeader :title="title" :count="count" :close-label="closeLabel" @close="emit('close')">
                <template v-if="$slots.leading" #leading>
                    <slot name="leading" />
                </template>
            </PanelHeader>
            <PanelBody>
                <slot />
            </PanelBody>
        </section>
    </Transition>
</template>
