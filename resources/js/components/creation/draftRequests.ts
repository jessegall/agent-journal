import type { DraftedRecordData, DraftQuestionsData } from '@/types/generated';
import { webDraftQuestions, webDraftRecord } from '@/generated/loaders';
import { load } from '@/framework/loaders';
import type { Loader } from '@/framework/loaders';

/**
 * Why a guided draft request did not give its answer: the server refused it, or no answer came.
 */
export class DraftRequestFailed extends Error {}

/**
 * The answer of a draft loader; any other end, invalid, unavailable or no answer at all, is a failed request.
 */
async function read<I, O>(loader: Loader<I, O>, input: I): Promise<O> {
    const answer = await load(loader, input).catch((failure: Error) => {
        throw new DraftRequestFailed(failure.message);
    });

    if (answer.status !== 'ok') {
        throw new DraftRequestFailed(`The draft request was answered ${answer.status}.`);
    }

    return answer.value;
}

/**
 * The questions the draft producer of a noun asks.
 */
export function readQuestions(noun: string): Promise<DraftQuestionsData> {
    return read(webDraftQuestions, { noun });
}

/**
 * The record the draft producer of a noun makes from the answers; nothing is saved.
 */
export function draftFrom(noun: string, answers: string[]): Promise<DraftedRecordData> {
    return read(webDraftRecord, { noun, answers });
}
