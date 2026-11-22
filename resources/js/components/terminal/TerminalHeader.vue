<script setup lang="ts">
import Button from '@/components/kit/Button.vue';
import Menu from '@/components/kit/Menu.vue';
import MenuItem from '@/components/kit/MenuItem.vue';

/**
 * The header of an agent's terminal window, in order: the agent, its driver, where it runs, who has the input, the
 * placement and the actions. A narrow window wraps it, keeps the agent, the input owner and the main action in
 * reach, and moves the placement actions into a named menu.
 */
export type TerminalHeaderAction = { key: string; label: string; run: () => void };

defineProps<{
    agentName: string;
    driver: string | null;
    location: string;
    owner: string;
    placement: string;
    main: TerminalHeaderAction;
    secondary: TerminalHeaderAction[];
}>();
</script>

<template>
    <header class="@container flex flex-none flex-wrap items-center gap-x-3 gap-y-1 px-3 py-1.5 text-small text-text-2">
        <span class="font-semibold text-text">{{ agentName }}</span>
        <template v-if="driver">
            <span>{{ driver }}</span>
        </template>
        <template v-if="location">
            <span>{{ location }}</span>
        </template>
        <span class="text-text">{{ owner }}</span>
        <span class="hidden @[28rem]:inline">{{ placement }}</span>
        <span class="flex-1"></span>
        <template v-for="action in secondary" :key="action.key">
            <span class="hidden @[28rem]:inline-flex">
                <Button variant="bordered" size="sm" @click="action.run">{{ action.label }}</Button>
            </span>
        </template>
        <template v-if="secondary.length > 0">
            <span class="@[28rem]:hidden">
                <Menu label="Terminal placement">
                    <template v-for="action in secondary" :key="action.key">
                        <MenuItem @click="action.run">{{ action.label }}</MenuItem>
                    </template>
                </Menu>
            </span>
        </template>
        <Button variant="primary" size="sm" @click="main.run">{{ main.label }}</Button>
    </header>
</template>
