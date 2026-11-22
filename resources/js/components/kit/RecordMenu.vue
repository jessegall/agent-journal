<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { useTemplateRef } from 'vue';
import { inertiaMethods } from '@/components/layout/layoutForm';
import { formSendingHooks } from '@/composables/usePageChanges';
import { useHostProp } from '@/framework/hostProp';
import type { LayoutMenuData, LayoutMenuItemData } from '@/generated/types/core';
import Icon from './Icon.vue';
import Menu from './Menu.vue';
import MenuItem from './MenuItem.vue';
import MenuItemLabel from './MenuItemLabel.vue';
import MenuSeparator from './MenuSeparator.vue';

/**
 * A record's actions menu as the server built it for this actor and this record: its groups in order, set apart by
 * separators, an item that opens a page as a link and one that sends an action as a button. The actions button opens
 * it for keyboard and touch; openFromContext opens the same menu on a right click on its host. A menu with no item
 * draws nothing.
 */
const props = defineProps<{ menu: LayoutMenuData }>();
const actions = useTemplateRef<InstanceType<typeof Menu>>('actions');
const hostProp = useHostProp();

function send(item: LayoutMenuItemData): void {
    router.visit(item.href, {
        method: inertiaMethods[item.method],
        only: [hostProp],
        preserveState: true,
        preserveScroll: true,
        ...formSendingHooks(),
    });
}

function openFromContext(): void {
    if (props.menu.groups.length === 0) {
        return;
    }

    actions.value?.open();
}

defineExpose({ openFromContext });
</script>

<template>
    <template v-if="menu.groups.length > 0">
        <Menu ref="actions" :label="menu.label">
            <template v-for="(group, index) in menu.groups" :key="group.key">
                <template v-if="index > 0">
                    <MenuSeparator />
                </template>
                <div role="group" class="flex flex-col">
                    <template v-for="item in group.items" :key="item.key">
                        <template v-if="item.method === 'GET'">
                            <MenuItem :href="item.href">
                                <template v-if="item.icon !== undefined" #leading>
                                    <Icon :name="item.icon" :size="14" />
                                </template>
                                <MenuItemLabel>{{ item.label }}</MenuItemLabel>
                            </MenuItem>
                        </template>
                        <template v-else>
                            <MenuItem @click="send(item)">
                                <template v-if="item.icon !== undefined" #leading>
                                    <Icon :name="item.icon" :size="14" />
                                </template>
                                <MenuItemLabel>{{ item.label }}</MenuItemLabel>
                            </MenuItem>
                        </template>
                    </template>
                </div>
            </template>
        </Menu>
    </template>
</template>
