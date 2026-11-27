import type { DraftedRecordData, DraftQuestionsData } from '@/types/generated';
import { webDraftQuestions, webDraftRecord } from '@/generated/loaders';
import { load } from '@/framework/loaders';
import type { Loader } from '@/framework/loaders';

/**
 * Why a guided draft request did not give its answer: the server refused it, or no answer came.
 */
export class DraftRequestFailed extends Error {
    /** No answer came from the journal. */
    static unanswered(cause: Error): DraftRequestFailed {
        return new DraftRequestFailed(cause.message, { cause });
    }

    /** The journal answered with something other than the draft. */
    static answered(status: string): DraftRequestFailed {
        return new DraftRequestFailed(`The draft request was answered ${status}.`);
    }
}

/**
 * The answer of a draft loader; any other end, invalid, unavailable or no answer at all, is a failed request.
 */
async function read<I, O>(loader: Loader<I, O>, input: I): Promise<O> {
    const answer = await load(loader, input).catch((failure: Error) => {
        throw DraftRequestFailed.unanswered(failure);
    });

    if (answer.status !== 'ok') {
        throw DraftRequestFailed.answered(answer.status);
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
