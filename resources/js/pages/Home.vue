<script setup lang="ts">
import { Head, usePage } from '@inertiajs/vue3';
import type { ChatData } from '@generated/types/chat';
import type { PlanListData } from '@generated/types/plans';
import { computed } from 'vue';
import HomePanes from '@/components/home/HomePanes.vue';
import { useLiveReload } from '@/composables/usePageChanges';
import type { WindowResult } from '@/generated/types/page-props';
import type { HomePage } from '@/types/generated';

const props = defineProps<{ page: HomePage }>();

useLiveReload();

/**
 * The chat window's own prop, once the browser has asked for it: its sessions name the agent in the bars.
 */
const pageProps = usePage().props;
const chat = computed(() => {
    const result = pageProps.window_chat_conversation as WindowResult<ChatData> | undefined;

    return result?.state === 'ready' ? result.data : undefined;
});
const session = computed(() => chat.value?.conversation?.sessionId);
const plans = computed(() => {
    const result = pageProps.window_plans_list as WindowResult<PlanListData> | undefined;

    return result?.state === 'ready' ? result.data : undefined;
});
</script>

<template>
    <Head title="Home" />
    <div class="@container h-full">
        <HomePanes :page="props.page" :chat="chat" :plans="plans" :session="session" />
    </div>
</template>
