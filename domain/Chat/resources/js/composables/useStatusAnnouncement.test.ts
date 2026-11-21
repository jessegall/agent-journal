import { describe, expect, it } from 'vitest';
import { nextTick, ref } from 'vue';
import type { AgentStatusData } from '@generated/types/chat';
import { useStatusAnnouncement } from './useStatusAnnouncement';

function status(sessionState: AgentStatusData['sessionState'], label: string, version = 1): AgentStatusData {
    return {
        sessionState,
        label,
        reason: sessionState === 'refused' ? 'Choose a model for this session.' : null,
        remedy: null,
        operation: { id: 'start-1', type: 'start', stage: sessionState, version },
        commandOutcome: null,
        observationAgeSeconds: null,
        actions: [],
    };
}

describe('useStatusAnnouncement', () => {
    it('says a change once, a refusal as an alert, and nothing while the dialog is open', async () => {
        const shown = ref<AgentStatusData>(status('starting', 'Starting'));
        const isDialogOpen = ref(false);
        const announcement = useStatusAnnouncement(() => shown.value, () => isDialogOpen.value);

        expect(announcement.polite.value).toBe('Starting');

        shown.value = status('refused', 'Start refused');
        await nextTick();
        expect(announcement.alert.value).toBe('Start refused. Choose a model for this session.');

        isDialogOpen.value = true;
        shown.value = status('idle', 'Idle', 2);
        await nextTick();
        expect(announcement.polite.value).toBe('');
    });
});
