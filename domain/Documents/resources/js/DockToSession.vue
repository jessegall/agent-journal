<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import type { DockSession } from '@generated/types/documents';
import Button from '@kit/Button';
import FormErrors from '@kit/FormErrors';
import { formSendingHooks } from '@kit/usePageChanges';

/**
 * Docks this record as a card in a running session you may use; docking it again shows the same card.
 */
const props = defineProps<{ type: 'doc' | 'report'; number: string; sessions: DockSession[] }>();

const form = useForm({ type: props.type, number: props.number, session: props.sessions[0]?.sessionId ?? '' });

function dock(): void {
    form.post('/documents/dock', { preserveScroll: true, ...formSendingHooks() });
}
</script>

<template>
    <template v-if="sessions.length > 0">
        <form class="flex flex-wrap gap-2" @submit.prevent="dock">
            <label class="flex flex-1 items-center gap-2">
                <span>Dock to session</span>
                <select v-model="form.session" class="input min-w-0 flex-1" :aria-invalid="form.errors.session ? 'true' : undefined" aria-describedby="dock-errors">
                    <template v-for="session in sessions" :key="session.sessionId">
                        <option :value="session.sessionId">{{ session.agentName }}</option>
                    </template>
                </select>
            </label>
            <Button type="submit" :pending="form.processing" :disabled="form.processing">Dock</Button>
            <div id="dock-errors">
                <FormErrors :errors="form.errors" />
            </div>
        </form>
    </template>
</template>
