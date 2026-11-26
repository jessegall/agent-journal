<script setup lang="ts">
import Button from "@kit/Button";
import Textarea from "@kit/Textarea";
import type { RequestWindowData } from "@generated/types/processes";
import type { RequestPayload } from "@inertiajs/core";
import { router } from "@inertiajs/vue3";
import { computed, ref } from "vue";

/**
 * The owner's actions on the rule the request uses: retire it with a reason, or restore one of its earlier revisions
 * as a new proposal. Each names the revision in use the owner read.
 */
const props = defineProps<{ data: RequestWindowData; ruleId: string }>();

const reason = ref("");
const earlierRevisions = computed(() =>
  Array.from(
    { length: props.data.activeRevision - 1 },
    (_, index) => index + 1,
  ),
);

function post(path: string, body: RequestPayload): void {
  router.post(path, body, {
    headers: { "Idempotency-Key": crypto.randomUUID() },
    preserveScroll: true,
  });
}

function retire(): void {
  post(`/processes/rules/${props.ruleId}/retirement`, {
    expected_revision: props.data.activeRevision,
    reason: reason.value,
  });
}

function restore(revision: number): void {
  post(`/processes/rules/${props.ruleId}/restoration`, {
    from_revision: revision,
    expected_revision: props.data.activeRevision,
    request_id: crypto.randomUUID(),
  });
}
</script>

<template>
  <form
    class="flex flex-col gap-2"
    aria-label="The rule in use"
    @submit.prevent="retire"
  >
    <label class="flex flex-col">
      <span>Reason to retire it</span>
      <Textarea v-model="reason" :rows="2" />
    </label>
    <div class="flex flex-wrap gap-2">
      <Button variant="bordered" type="submit" :disabled="reason === ''">
        Retire revision {{ data.activeRevision }}
      </Button>
      <template v-for="revision in earlierRevisions" :key="revision">
        <Button variant="bordered" @click="restore(revision)">
          Restore revision {{ revision }}
        </Button>
      </template>
    </div>
  </form>
</template>
