<script setup lang="ts">
import { Form } from '@inertiajs/vue3';
import { computed } from 'vue';
import Button from '@/components/kit/Button.vue';
import Icon from '@/components/kit/Icon.vue';
import Input from '@/components/kit/Input.vue';
import Menu from '@/components/kit/Menu.vue';
import MenuItem from '@/components/kit/MenuItem.vue';
import type { Appearance } from '@/composables/useAppearance';
import { useAppearance } from '@/composables/useAppearance';
import { useShellOverlays } from '@/composables/useShellOverlays';
import { useSidebar } from '@/composables/useSidebar';
import { useAppContext } from '@/framework/appContext';
import { logout } from '@/routes';
import NotificationBell from './NotificationBell.vue';
import ProjectMenu from './ProjectMenu.vue';

/**
 * The 40 px topbar: the journal and page breadcrumb; on the right the project menu, the notification bell with its
 * unread count, the button that folds the sidebar to its rail (on a phone, opens the navigation sheet), the theme menu,
 * full screen, and the signed-in user with sign out, which hands off to the authentication sign-out.
 */
defineProps<{ title: string }>();

const { installation, viewer } = useAppContext();
const appName = computed(() => installation.value.name);
const userName = computed(() => viewer.value.name);
const { appearance, update } = useAppearance();
const { toggle: toggleSidebar, isMini } = useSidebar();
const { isPaletteOpen, isHelpOpen, isSearchOpen } = useShellOverlays();

const schemes: { value: Appearance; label: string }[] = [
    { value: 'system', label: 'System' },
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
];

function toggleFullScreen(): void {
    if (document.fullscreenElement) {
        void document.exitFullscreen();

        return;
    }

    void document.documentElement.requestFullscreen();
}
</script>

<template>
    <header
        class="relative flex h-10 shrink-0 items-center gap-2 border-b border-border px-4 text-body text-text-2"
    >
        <nav class="flex min-w-0 items-center gap-2" aria-label="Breadcrumb">
            <span class="size-2 rounded-[2px] bg-brand" aria-hidden="true"></span>
            <span>{{ appName }}</span>
            <span class="text-text-4" aria-hidden="true">/</span>
            <span class="truncate font-medium text-text" aria-current="page">{{
                title
            }}</span>
        </nav>
        <span class="flex-1"></span>
        <div class="flex items-center gap-2" role="group" aria-label="Shell actions">
            <ProjectMenu />
            <label class="relative flex w-56 items-center">
                <Icon name="search" :size="13" class="pointer-events-none absolute left-2.5 text-text-3" />
                <Input
                    size="sm"
                    class="w-full cursor-pointer pl-7"
                    aria-label="Search"
                    placeholder="Search"
                    readonly
                    @keydown="isSearchOpen = true"
                    @click="isSearchOpen = true"
                />
            </label>
            <Button variant="icon" aria-label="Open commands" @click="isPaletteOpen = true"
                ><Icon name="list" :size="13"
            /></Button>
            <Button variant="icon" aria-label="Keyboard help" @click="isHelpOpen = true"
                ><Icon name="question" :size="13"
            /></Button>
            <template v-if="userName">
                <NotificationBell />
            </template>
            <Button
                variant="icon"
                :aria-label="isMini ? 'Show the page names' : 'Hide the page names'"
                :title="isMini ? 'Show the page names' : 'Hide the page names'"
                @click="toggleSidebar"
                ><Icon name="list" :size="13"
            /></Button>
            <Menu label="Color scheme">
                <template #trigger><Icon name="scheme" :size="13" /></template>
                <template v-for="scheme in schemes" :key="scheme.value">
                    <MenuItem radio :checked="appearance === scheme.value" @click="update(scheme.value)">{{
                        scheme.label
                    }}</MenuItem>
                </template>
            </Menu>
            <Button
                variant="icon"
                aria-label="Full screen"
                @click="toggleFullScreen"
                ><Icon name="wide" :size="13"
            /></Button>
            <template v-if="userName">
                <span class="text-small text-text-3 max-[760px]:hidden">{{ userName }}</span>
                <Form v-bind="logout.form()">
                    <Button type="submit" variant="icon" aria-label="Sign out"
                        ><Icon name="power" :size="13"
                    /></Button>
                </Form>
            </template>
        </div>
    </header>
</template>
