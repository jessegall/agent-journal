<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import ChatWindow from '@domain/chat/ChatWindow.vue';
import type { ChatData } from '@generated/types/chat';
import PaneGrid from '@/components/panes/PaneGrid.vue';
import WindowHost from '@/framework/WindowHost.vue';
import PlansWindow from '@domain/plans/PlansWindow.vue';
import type { PlanListData } from '@generated/types/plans';
import { ruleQuery } from '@/components/rules/ruleLooks';
import SwitchCase from '@/components/kit/SwitchCase.vue';
import RulesView from '@/components/rules/RulesView.vue';
import { providePaneLayout } from '@/composables/usePaneLayout';
import type {
    HomePage,
    RuleFiltersData,
} from '@/types/generated';
import AgentBar from './AgentBar.vue';
import InformationBar from './InformationBar.vue';

/**
 * Home as version 5 draws it: the agent bar, the information bar, then the pane grid with the Chat, Plans and Rules
 * windows. Every link keeps every window's state in Home's query; the rules window's search and page carry the prefix
 * rules_ so they do not meet the plans window's.
 */
const props = defineProps<{ page: HomePage; chat?: ChatData; plans?: PlanListData; session?: string }>();

const RULES_KEY_PREFIX = 'rules_';
const currentPage = usePage();

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
        count: props.page.rules.pagination.total,
    },
]);

const agentName = computed(
    () =>
        props.chat?.sessions.find((each) => each.id === props.session)
            ?.agentName,
);

/**
 * A link that changes only the rules window's search and page, under its prefix, and keeps the rest of Home's query.
 */
function rulesUrl(filters: RuleFiltersData): string {
    const url = new URL(currentPage.url, 'http://journal.local');

    for (const name of [...url.searchParams.keys()]) {
        if (name.startsWith(RULES_KEY_PREFIX)) {
            url.searchParams.delete(name);
        }
    }

    for (const [name, value] of Object.entries(ruleQuery(filters, RULES_KEY_PREFIX))) {
        if (value !== undefined) {
            url.searchParams.set(name, String(value));
        }
    }

    return `${url.pathname}${url.search}`;
}
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
                        <RulesView
                            :rules="page.rules"
                            :url-for-filters="rulesUrl"
                        />
                    </template>
                </SwitchCase>
            </template>
        </PaneGrid>
    </div>
</template>
