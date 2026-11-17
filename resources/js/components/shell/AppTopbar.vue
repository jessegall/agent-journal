<script setup lang="ts">
import { Form, usePage } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import Button from '@/components/kit/Button.vue';
import Icon from '@/components/kit/Icon.vue';
import type { Appearance } from '@/composables/useAppearance';
import { useAppearance } from '@/composables/useAppearance';
import { useSidebar } from '@/composables/useSidebar';
import { logout } from '@/routes';

/**
 * Version 5's breadcrumb with its top buttons (shell/Breadcrumb.vue, windows/StageTopButtons.vue; doc 12 section 1.1):
 * 40 px, the project swatch and name, then the page; on the right the sidebar button, the colour scheme menu, full
 * screen, and version 6's signed-in viewer with sign out.
 */
defineProps<{ title: string }>();

const page = usePage();
const appName = computed(() => page.props.name);
const viewerName = computed(() => page.props.viewer?.name);
const { appearance, update } = useAppearance();
const { toggle: toggleSidebar } = useSidebar();
const isSchemeMenuOpen = ref(false);

const schemes: { value: Appearance; label: string }[] = [
    { value: 'system', label: 'Follow the system' },
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
];

function chooseScheme(value: Appearance): void {
    update(value);
    isSchemeMenuOpen.value = false;
}

function toggleFullScreen(): void {
    if (document.fullscreenElement) {
        void document.exitFullscreen();

        return;
    }

    void document.documentElement.requestFullscreen();
}
</script>

<template>
    <nav
        class="relative flex min-h-10 shrink-0 items-center gap-2 border-b border-border px-4 text-body text-text-2"
        aria-label="Breadcrumb"
    >
        <span class="size-2 rounded-[2px] bg-brand" aria-hidden="true"></span>
        <span>{{ appName }}</span>
        <span class="text-text-4" aria-hidden="true">/</span>
        <span class="font-medium text-text" aria-current="page">{{
            title
        }}</span>
        <span class="flex-1"></span>
        <Button
            variant="icon"
            aria-label="Show or hide the sidebar"
            @click="toggleSidebar"
            ><Icon name="list" :size="13"
        /></Button>
        <div class="relative">
            <Button
                variant="icon"
                aria-label="Colour scheme"
                :aria-expanded="isSchemeMenuOpen"
                @click="isSchemeMenuOpen = !isSchemeMenuOpen"
                ><Icon name="scheme" :size="13"
            /></Button>
            <div
                v-if="isSchemeMenuOpen"
                class="absolute top-8 right-0 z-90 flex w-[200px] flex-col gap-0.5 rounded-menu border border-border-2 bg-raised p-1.5 shadow-[0_14px_36px_rgba(0,0,0,.45)]"
                role="menu"
            >
                <span
                    class="block px-2 pt-2.5 pb-1 text-group font-semibold tracking-[.06em] text-text-4 uppercase"
                    >Color scheme</span
                >
                <button
                    v-for="scheme in schemes"
                    :key="scheme.value"
                    type="button"
                    role="menuitemradio"
                    :aria-checked="appearance === scheme.value"
                    class="flex items-center gap-2 rounded-control px-2 py-1.5 text-left text-small text-text-2 hover:bg-hover hover:text-text"
                    :class="{
                        'bg-brand/16 text-text': appearance === scheme.value,
                    }"
                    @click="chooseScheme(scheme.value)"
                >
                    {{ scheme.label }}
                </button>
            </div>
        </div>
        <Button
            variant="icon"
            aria-label="Full screen"
            @click="toggleFullScreen"
            ><Icon name="wide" :size="13"
        /></Button>
        <template v-if="viewerName">
            <span class="text-small text-text-3">{{ viewerName }}</span>
            <Form v-bind="logout.form()">
                <Button type="submit" variant="icon" aria-label="Sign out"
                    ><Icon name="power" :size="13"
                /></Button>
            </Form>
        </template>
    </nav>
</template>
