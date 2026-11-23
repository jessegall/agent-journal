<script setup lang="ts">
import TextLink from "@/components/kit/TextLink.vue";
import { usePage } from "@inertiajs/vue3";
import { computed } from "vue";
import GuidedChatDialog from "@/components/creation/GuidedChatDialog.vue";
import CommandPalette from "@/components/shell/CommandPalette.vue";
import SearchPalette from "@/components/shell/SearchPalette.vue";
import KeyboardHelp from "@/components/shell/KeyboardHelp.vue";
import AppSidebar from "@/components/shell/AppSidebar.vue";
import AppTopbar from "@/components/shell/AppTopbar.vue";
import ToastRegion from "@/components/shell/ToastRegion.vue";
import {
  liveStage,
  retryLiveConnection,
  useLiveConnection,
} from "@/composables/useLiveConnection";
import { usePresenceHeartbeat } from "@/composables/usePresenceHeartbeat";
import { useShellShortcuts } from "@/composables/useShellOverlays";

/**
 * The persistent shell every signed-in page sits in: it stays mounted across visits, only the page inside changes, and
 * it holds the tab's one live connection, its one presence heartbeat, its one toast region and the overlay layer every dialog mounts into, apart from the
 * reconnect status.
 */
const page = usePage();

useLiveConnection();
usePresenceHeartbeat();
useShellShortcuts();
// The declared page's own title, such as Documents; a page from outside the declarations shows its component.
const title = computed(() =>
  typeof page.props.title === "string" ? page.props.title : page.component,
);
</script>

<template>
  <div class="flex h-dvh w-full overflow-hidden bg-bg text-text">
    <AppSidebar />
    <div class="flex min-w-0 flex-1 flex-col">
      <AppTopbar :title="title" />
      <template v-if="liveStage === 'refused'">
        <p
          role="status"
          class="flex items-center gap-2 border-b border-border px-4 py-1 text-small text-text-3"
        >
          Reconnecting…
          <TextLink @click="retryLiveConnection()">Retry</TextLink>
        </p>
      </template>
      <main class="min-h-0 flex-1 overflow-hidden"><slot /></main>
    </div>
    <ToastRegion />
    <GuidedChatDialog />
    <CommandPalette />
    <SearchPalette />
    <KeyboardHelp />
    <div id="overlay-layer" class="contents"></div>
  </div>
</template>
