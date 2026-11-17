<script setup lang="ts">
import { computed } from 'vue';
import ChatWindow from '@domain/chat/ChatWindow.vue';
import type { ChatData } from '@generated/types/chat';
import PaneGrid from '@/components/panes/PaneGrid.vue';
import WindowHost from '@/framework/WindowHost.vue';
import PlansView from '@/components/plans/PlansView.vue';
import { planQuery } from '@/components/plans/planUrls';
import { ruleQuery } from '@/components/rules/ruleLooks';
import SwitchCase from '@/components/kit/SwitchCase.vue';
import RulesView from '@/components/rules/RulesView.vue';
import { providePaneLayout } from '@/composables/usePaneLayout';
import { home } from '@/routes';
import type {
    HomePage,
    PlanFiltersData,
    RuleFiltersData,
} from '@/types/generated';
import AgentBar from './AgentBar.vue';
import InformationBar from './InformationBar.vue';

/**
 * Home as version 5 draws it: the agent bar, the information bar, then the pane grid with the Chat, Plans and Rules
 * windows. Every link keeps every window's state in Home's query; the rules window's search and page carry the prefix
 * rules_ so they do not meet the plans window's.
 */
const props = defineProps<{ page: HomePage; chat?: ChatData; session?: string }>();

const RULES_KEY_PREFIX = 'rules_';

providePaneLayout('home-layout', () => [
    { key: 'chat', title: 'Chat', icon: 'chat' },
    {
        key: 'plans',
        title: 'Plans',
        icon: 'plan',
        count: props.page.plans.pagination.total,
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

function homeUrl(
    plans: PlanFiltersData,
    rules: RuleFiltersData,
    session: string | undefined,
): string {
    return home.url({
        query: {
            ...planQuery(plans),
            ...ruleQuery(rules, RULES_KEY_PREFIX),
            session,
            window: session === undefined ? undefined : { 'chat.conversation': { session } },
        },
    });
}

function plansUrl(filters: PlanFiltersData): string {
    return homeUrl(filters, props.page.rules.filters, props.session);
}

function rulesUrl(filters: RuleFiltersData): string {
    return homeUrl(props.page.plans.filters, filters, props.session);
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
                        <WindowHost :component="ChatWindow" prop-name="window_chat_conversation" />
                    </template>
                    <template #plans>
                        <PlansView
                            :plans="page.plans"
                            :url-for-filters="plansUrl"
                        />
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
