<script setup lang="ts">
import { computed } from 'vue';
import ChatWindow from '@domain/chat/ChatWindow.vue';
import type { ChatData } from '@generated/types/chat';
import PaneGrid from '@/components/panes/PaneGrid.vue';
import WindowHost from '@/framework/WindowHost.vue';
import PlansWindow from '@domain/plans/PlansWindow.vue';
import type { PlanListData } from '@generated/types/plans';
import SwitchCase from '@/components/kit/SwitchCase.vue';
import RulesWindow from '@domain/rules/RulesWindow.vue';
import type { RuleListData } from '@generated/types/rules';
import { providePaneLayout } from '@/composables/usePaneLayout';
import type { HomePage } from '@/types/generated';
import AgentBar from './AgentBar.vue';
import InformationBar from './InformationBar.vue';

/**
 * Home as version 5 draws it: the agent bar, the information bar, then the pane grid with the Chat, Plans and Rules
 * windows, each the owner's own window: its links change only its own part of Home's query, window[<key>].
 */
const props = defineProps<{ page: HomePage; chat?: ChatData; plans?: PlanListData; rules?: RuleListData; session?: string }>();

providePaneLayout('home-layout', () => [
    { key: 'chat', title: 'Chat', icon: 'chat' },
    {
        key: 'plans',
        title: 'Plans',
        icon: 'plan',
        count: props.plans?.pagination.total,
    },
    {
        key: 'rules',
        title: 'Rules',
        icon: 'rules',
        count: props.rules?.pagination.total,
    },
]);

const agentName = computed(
    () =>
        props.chat?.sessions.find((each) => each.id === props.session)
            ?.agentName,
);

</script>

<template>
    <div class="flex h-full min-h-0 flex-col">
        <AgentBar :agent-name="agentName" />
        <InformationBar :agent-name="agentName" :layouts="page.layouts" />
        <PaneGrid>
            <template #default="{ windowKey }">
                <SwitchCase :value="windowKey">
                    <template #chat>
                        <WindowHost :component="ChatWindow" prop-name="window_chat_conversation" page-key="chat.conversation" />
                    </template>
                    <template #plans>
                        <WindowHost :component="PlansWindow" prop-name="window_plans_list" page-key="plans.list" />
                    </template>
                    <template #rules>
                        <WindowHost :component="RulesWindow" prop-name="window_rules_list" page-key="rules.list" />
                    </template>
                </SwitchCase>
            </template>
        </PaneGrid>
    </div>
</template>
