<script setup lang="ts">
import { ref } from 'vue';
import Button from '@/components/kit/Button.vue';
import Icon from '@/components/kit/Icon.vue';
import MenuList from '@/components/panes/MenuList.vue';
import { usePaneLayout } from '@/composables/usePaneLayout';

/**
 * Version 5's information bar (shell/InformationBar.vue) under decision D3: 30 px of 12 px facts, of which version 6
 * has only the lead, the chosen agent's name; the layouts button sits at the right and offers the Default layout.
 */
defineProps<{ agentName?: string }>();

const store = usePaneLayout();
const isLayoutMenuOpen = ref(false);
</script>

<template>
    <div
        class="relative flex min-h-[30px] flex-none items-center gap-4 border-b border-border pr-[5px] pl-4 text-small text-text-3 max-[760px]:flex-wrap"
    >
        <template v-if="agentName">
            <span
                class="-mx-1 inline-flex flex-none items-center gap-[5px] px-1 whitespace-nowrap text-text"
            >
                <Icon name="agents" :size="12" />{{ agentName }}
            </span>
        </template>
        <span class="flex-1"></span>
        <Button
            variant="icon"
            aria-label="Layouts"
            title="Layouts"
            :aria-expanded="isLayoutMenuOpen"
            @click="isLayoutMenuOpen = !isLayoutMenuOpen"
            ><Icon name="layout" :size="13"
        /></Button>
        <template v-if="isLayoutMenuOpen">
            <MenuList
                title="Layouts"
                :entries="[
                    {
                        label: 'Default',
                        checked: store.isDefault.value,
                        run: store.reset,
                    },
                ]"
                class="absolute top-[30px] right-[5px]"
                @done="isLayoutMenuOpen = false"
            />
        </template>
    </div>
</template>
