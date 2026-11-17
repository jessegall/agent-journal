<script setup lang="ts">
import ChatPane from '@/components/chat/ChatPane.vue';
import PlansView from '@/components/plans/PlansView.vue';
import { planQuery } from '@/components/plans/planUrls';
import { home } from '@/routes';
import type { HomePage, PlanFiltersData } from '@/types/generated';

/**
 * Home's two panes: the chat on the left, the same plans slice the plans page shows on the right. Every link keeps
 * both panes' state in Home's query.
 */
const props = defineProps<{ page: HomePage; session?: string }>();

function sessionUrl(session: string): string {
    return home.url({
        query: { ...planQuery(props.page.plans.filters), session },
    });
}

function plansUrl(filters: PlanFiltersData): string {
    return home.url({
        query: { ...planQuery(filters), session: props.session },
    });
}
</script>

<template>
    <div
        class="grid h-full min-h-0 grid-cols-1 @5xl:grid-cols-[minmax(360px,2fr)_3fr]"
    >
        <ChatPane
            :chat="page.chat"
            :session-url="sessionUrl"
            class="border-r border-border"
        />
        <PlansView :plans="page.plans" :url-for-filters="plansUrl" />
    </div>
</template>
