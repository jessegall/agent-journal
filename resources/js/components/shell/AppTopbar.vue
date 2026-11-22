<script setup lang="ts">
import { Form, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import Button from '@/components/kit/Button.vue';
import Icon from '@/components/kit/Icon.vue';
import Menu from '@/components/kit/Menu.vue';
import MenuItem from '@/components/kit/MenuItem.vue';
import type { Appearance } from '@/composables/useAppearance';
import { useAppearance } from '@/composables/useAppearance';
import { useSidebar } from '@/composables/useSidebar';
import { logout } from '@/routes';
import EnvironmentMenu from './EnvironmentMenu.vue';
import NotificationBell from './NotificationBell.vue';

/**
 * The 40 px topbar: the journal and page breadcrumb; on the right the environment menu, the notification bell with its
 * unread count, the button that folds the sidebar to its rail (on a phone, opens the navigation sheet), the theme menu,
 * full screen, and the signed-in user with sign out, which hands off to the authentication sign-out.
 */
defineProps<{ title: string }>();

const page = usePage();
const appName = computed(() => page.props.name);
const userName = computed(() => page.props.currentUser?.name);
const { appearance, update } = useAppearance();
const { toggle: toggleSidebar } = useSidebar();

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
            <EnvironmentMenu />
            <template v-if="userName">
                <NotificationBell />
            </template>
            <Button
                variant="icon"
                aria-label="Show or hide the sidebar"
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
