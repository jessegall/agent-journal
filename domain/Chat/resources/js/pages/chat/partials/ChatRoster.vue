<script setup lang="ts">
import TextLink from "@kit/TextLink";
import { router } from "@inertiajs/vue3";
import { readPage } from "@kit/pageReads";
import { computed, ref } from "vue";
import Button from "@kit/Button";
import type { ConversationData, SpeakerData } from "@generated/types/chat";
import {
  addMember,
  close,
  leave,
  removeMember,
  transfer,
} from "@generated/routes/chat";
import ParticipantRow from "./ParticipantRow.vue";

/**
 * Who is in the chat and, offered only where the server's capabilities allow, the owner's controls: add an eligible
 * user or agent, remove a member, hand the chat over, close it; any member may leave. Each change posts and reloads the room,
 * and the server checks it again.
 */
const props = defineProps<{
  conversation: ConversationData;
  conversationProp: string;
  chosenAgentId?: string | null;
}>();

const emit = defineEmits<{ chooseAgent: [agentId: string] }>();

const capabilities = computed(() => props.conversation.capabilities);
const others = computed(() =>
  props.conversation.participants.filter(
    (member) => member.actor !== props.conversation.viewer,
  ),
);
const isOwner = computed(() =>
  props.conversation.participants.some(
    (member) =>
      member.actor === props.conversation.viewer && member.role === "owner",
  ),
);
const found = ref<SpeakerData[]>([]);

const membersList = ref<HTMLElement | null>(null);

function post(url: string, data: Record<string, string>): void {
  router.post(
    url,
    { inboxId: props.conversation.inboxId, ...data },
    {
      preserveScroll: true,
      preserveState: true,
      only: [props.conversationProp],
    },
  );
}

/**
 * Removes a member; the focus then rests on the members list, since the row that held it is gone.
 */
function remove(participant: string): void {
  router.post(
    removeMember().url,
    { inboxId: props.conversation.inboxId, participant },
    {
      preserveScroll: true,
      preserveState: true,
      only: [props.conversationProp],
      onFinish: () => membersList.value?.focus(),
    },
  );
}

function findCandidates(): void {
  void readPage<{ candidates: SpeakerData[] }>("chat.candidates", {
    inboxId: props.conversation.inboxId,
  }).then((answer) => (found.value = answer.candidates));
}
</script>

<template>
  <section class="flex flex-col gap-1.5 p-2" aria-label="Members">
    <ul
      ref="membersList"
      class="flex flex-col gap-1"
      tabindex="-1"
      aria-label="Members of this chat"
    >
      <template
        v-for="participant in conversation.participants"
        :key="participant.actor"
      >
        <ParticipantRow :participant="participant">
          <template v-if="participant.actor.startsWith('agent:')">
            <TextLink
              :aria-pressed="participant.actor === `agent:${chosenAgentId}`"
              aria-controls="chosen-agent-controls"
              :aria-label="`Session controls for ${participant.label}`"
              @click="
                emit('chooseAgent', participant.actor.slice('agent:'.length))
              "
            >
              Session
            </TextLink>
          </template>
          <template
            v-if="
              participant.actor !== conversation.viewer && capabilities.remove
            "
          >
            <TextLink
              :aria-label="`Remove ${participant.label}`"
              @click="remove(participant.actor)"
            >
              Remove
            </TextLink>
          </template>
          <template
            v-if="
              participant.actor !== conversation.viewer && capabilities.transfer
            "
          >
            <TextLink
              @click="post(transfer().url, { participant: participant.actor })"
            >
              Make owner
            </TextLink>
          </template>
        </ParticipantRow>
      </template>
    </ul>
    <template v-if="capabilities.add">
      <div class="flex flex-col gap-1">
        <Button
          type="button"
          size="small"
          variant="bordered"
          @click="findCandidates"
          >Add users</Button
        >
        <ul class="flex flex-col gap-0.5">
          <template v-for="candidate in found" :key="candidate.actor">
            <li class="flex items-center justify-between text-body">
              <span>
                {{ candidate.label }}
                <template v-if="candidate.driver !== null">
                  <span class="text-small text-text-3">{{
                    candidate.driver
                  }}</span>
                </template>
              </span>
              <TextLink
                @click="post(addMember().url, { participant: candidate.actor })"
              >
                Add
              </TextLink>
            </li>
          </template>
        </ul>
      </div>
    </template>
    <div class="flex gap-2">
      <template v-if="capabilities.leave">
        <Button
          type="button"
          size="small"
          variant="bordered"
          @click="post(leave().url, {})"
          >Leave</Button
        >
      </template>
      <template v-else-if="isOwner && others.length > 0">
        <p class="text-small text-text-3">
          Make another member the owner before you leave, or close the chat.
        </p>
      </template>
      <template v-if="capabilities.close">
        <Button
          type="button"
          size="small"
          variant="bordered"
          @click="post(close().url, {})"
          >Close chat</Button
        >
      </template>
    </div>
  </section>
</template>
