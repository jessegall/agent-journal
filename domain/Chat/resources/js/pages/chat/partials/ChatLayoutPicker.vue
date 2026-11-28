<script setup lang="ts">
import Button from "@kit/Button";
import Popover from "@kit/Popover";
import SegmentedControl from "@kit/SegmentedControl";
import SegmentedItem from "@kit/SegmentedItem";
import { useAppContext } from "@kit/appContext";
import { computed, ref, useTemplateRef } from "vue";
import { useOpenChats } from "../../../composables/useOpenChats";

/**
 * The chat layout of Home's one chat bar, as one icon: it shows how many chats show side by side now, and opens the
 * layouts to pick from, each drawn as its columns: one chat, two side by side, three, as many as there are open chats.
 */
const openChats = useOpenChats(useAppContext().viewer.value.id ?? "guest");
const trigger = useTemplateRef<InstanceType<typeof Button>>("trigger");
const anchor = computed<HTMLElement | null>(() => trigger.value?.$el ?? null);
const isOpen = ref(false);
const choices = computed(() => openChats.columnChoices());
const items = computed(() => choices.value.map((count) => ({ value: String(count), label: nameOf(count) })));

function nameOf(count: number): string {
  return count === 1 ? "One chat" : `${count} chats side by side`;
}
</script>

<template>
  <Button
    ref="trigger"
    variant="bare"
    class="flex size-6 items-center justify-center rounded-control text-text-3 hover:bg-hover hover:text-text focus-visible:outline-2 focus-visible:outline-focus"
    aria-haspopup="dialog"
    :aria-expanded="isOpen"
    :aria-label="`Chat layout: ${nameOf(openChats.chats.columns)}`"
    :title="`Chat layout: ${nameOf(openChats.chats.columns)}`"
    data-chat-layout
    @click="isOpen = !isOpen"
  >
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" aria-hidden="true">
      <rect x="1.5" y="2.5" width="11" height="9" rx="1.5" />
      <template v-for="divider in openChats.chats.columns - 1" :key="divider">
        <path :d="`M${1.5 + (11 / openChats.chats.columns) * divider} 2.5v9`" />
      </template>
    </svg>
  </Button>
  <Popover v-model:open="isOpen" label="Chat layout" :anchor="anchor" align="right">
    <SegmentedControl
      bare
      label="Chat layout"
      :items="items"
      :model-value="String(openChats.chats.columns)"
      class="flex gap-1 p-1.5"
      @update:model-value="openChats.showColumns(Number($event))"
    >
      <template #items>
        <SegmentedItem
          v-for="count in choices"
          :key="count"
          bare
          :value="String(count)"
          class="flex size-9 items-center justify-center rounded-control text-text-3 hover:bg-hover hover:text-text aria-checked:bg-sel aria-checked:text-text"
          :aria-label="nameOf(count)"
          :title="nameOf(count)"
          :data-chat-layout-choice="count"
          @click="isOpen = false"
        >
          <svg width="22" height="16" viewBox="0 0 22 16" fill="none" stroke="currentColor" aria-hidden="true">
            <template v-for="column in count" :key="column">
              <rect
                :x="1 + ((20 + 2) / count) * (column - 1)"
                y="1.5"
                :width="(20 + 2) / count - 2"
                height="13"
                rx="1.5"
              />
            </template>
          </svg>
        </SegmentedItem>
      </template>
    </SegmentedControl>
  </Popover>
</template>
