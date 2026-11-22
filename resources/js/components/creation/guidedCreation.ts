import { ref } from 'vue';
import type { DraftedRecordData } from '@/generated/types/core';

/**
 * What a guided creation was opened for: the noun it drafts, and what to do with the fields it drafted, such as filling
 * the plain form under a DraftedBanner. The shell's dialog host shows the dialog while one is asked for.
 */
export type GuidedRequest = {
    noun: string;
    onDraft: (draft: DraftedRecordData) => void;
};

const request = ref<GuidedRequest | null>(null);

/**
 * The guided creation now asked for, shared by the control that asks and the dialog host that shows it.
 */
export function useGuidedCreation() {
    return {
        request,
        ask: (asked: GuidedRequest) => {
            request.value = asked;
        },
        end: () => {
            request.value = null;
        },
    };
}
