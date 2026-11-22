<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { useTemplateRef } from 'vue';
import { inertiaMethods } from '@/components/layout/layoutForm';
import { formSendingHooks } from '@/composables/usePageChanges';
import { useHostProp } from '@/framework/hostProp';
import type { LayoutMenuData, LayoutMenuItemData } from '@/generated/types/core';
import ActionsMenu from './ActionsMenu.vue';
import ActionsMenuItem from './ActionsMenuItem.vue';
import Icon from './Icon.vue';

/**
 * A record's actions menu as the server built it for this actor and this record: its groups in order, set apart by
 * separators, an item that opens a page as a link and one that sends an action as a button. The actions button opens
 * it for keyboard and touch; openFromContext opens the same menu on a right click on its host. A menu with no item
 * draws nothing.
 */
const props = defineProps<{ menu: LayoutMenuData }>();
const actions = useTemplateRef<InstanceType<typeof ActionsMenu>>('actions');
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

    actions.value?.openFromContext();
}

defineExpose({ openFromContext });
</script>

<template>
    <template v-if="menu.groups.length > 0">
        <ActionsMenu ref="actions" :label="menu.label">
            <template v-for="(group, index) in menu.groups" :key="group.key">
                <template v-if="index > 0">
                    <hr role="separator" class="my-0.5 border-line" />
                </template>
                <div role="group" class="flex flex-col gap-0.5">
                    <template v-for="item in group.items" :key="item.key">
                        <template v-if="item.method === 'GET'">
                            <ActionsMenuItem :href="item.href">
                                <template v-if="item.icon !== undefined">
                                    <Icon :name="item.icon" :size="13" />
                                </template>
                                {{ item.label }}
                            </ActionsMenuItem>
                        </template>
                        <template v-else>
                            <ActionsMenuItem @click="send(item)">
                                <template v-if="item.icon !== undefined">
                                    <Icon :name="item.icon" :size="13" />
                                </template>
                                {{ item.label }}
                            </ActionsMenuItem>
                        </template>
                    </template>
                </div>
            </template>
        </ActionsMenu>
    </template>
</template>
