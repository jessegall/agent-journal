import type { DraftedRecordData, DraftQuestionsData } from '@/types/generated';
import { readPage } from '@kit/pageReads';

/**
 * Why a guided draft request did not give its answer: the server refused it, or no answer came.
 */
export class DraftRequestFailed extends Error {}

function read<T>(routeName: string, query: Record<string, string | string[]>): Promise<T> {
    return readPage<T>(routeName, query).catch((failure: Error) => {
        throw new DraftRequestFailed(failure.message);
    });
}

/**
 * The questions the draft producer of a noun asks.
 */
export function readQuestions(noun: string): Promise<DraftQuestionsData> {
    return read<DraftQuestionsData>('web.draft-questions', { noun });
}

/**
 * The record the draft producer of a noun makes from the answers; nothing is saved.
 */
export function draftFrom(noun: string, answers: string[]): Promise<DraftedRecordData> {
    return read<DraftedRecordData>('web.draft-record', { noun, answers });
}
