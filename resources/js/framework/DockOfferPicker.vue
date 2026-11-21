<script setup lang="ts">
import { ref } from 'vue';
import type { DockOfferData } from '@/generated/types/core';
import { keyedPost } from './keyedPost';

/**
 * The offer to dock the source a window shows: the action opens a picker of the viewer's destinations, shows the one
 * chosen before anything is docked, and cancel docks nothing. A source that can no longer be docked says so and keeps
 * the choice.
 */
const props = defineProps<{ offer: DockOfferData }>();

const answers: Record<string, string> = {
    added: 'Added to the chat',
    present: 'Already in the chat',
    unavailable: 'This cannot be docked',
};
const choosing = ref(false);
const chosen = ref<string | null>(props.offer.destinations[0]?.value ?? null);
const answer = ref<string | null>(null);

function cancel(): void {
    choosing.value = false;
    answer.value = null;
}

/**
 * Docks through the chat page's own action; what came of it arrives as the answer's one-time flash, and a refusal as
 * its errors.
 */
function confirm(): void {
    if (chosen.value === null) {
        return;
    }

    keyedPost(
        props.offer.url,
        { [props.offer.destinationField]: chosen.value, type: props.offer.type, id: props.offer.id },
        crypto.randomUUID(),
        {
            onAccepted: (flash) => {
                const outcome = typeof flash.dockOutcome === 'string' ? flash.dockOutcome : 'unavailable';
                answer.value = answers[outcome] ?? outcome;

                if (outcome !== 'unavailable') {
                    choosing.value = false;
                }
            },
            onRefused: (reason) => (answer.value = reason ?? answers.unavailable),
            onUncertain: () => (answer.value = 'The journal did not answer; add it again to be sure.'),
        },
    );
}
</script>

<template>
    <div class="flex flex-wrap items-center gap-2 text-sm">
        <button type="button" class="underline" :aria-expanded="choosing" @click="choosing = true">
            {{ offer.label }}
        </button>
        <template v-if="choosing">
            <fieldset class="flex flex-wrap items-center gap-2">
                <legend class="sr-only">Choose a chat</legend>
                <template v-for="destination in offer.destinations" :key="destination.value">
                    <label class="flex items-center gap-1">
                        <input v-model="chosen" type="radio" name="dock-destination" :value="destination.value" />
                        {{ destination.label }}
                    </label>
                </template>
            </fieldset>
            <button type="button" class="underline" :disabled="chosen === null" @click="confirm">Add</button>
            <button type="button" class="underline" @click="cancel">Cancel</button>
        </template>
        <template v-if="answer !== null">
            <span role="status">{{ answer }}</span>
        </template>
    </div>
</template>
