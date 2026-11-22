import { draftQuestions, draftRecord } from '@generated/routes/web';
import { xsrfToken } from '@/echo';
import type { DraftedRecordData, DraftQuestionsData } from '@/generated/types/core';

/**
 * Why a guided draft request did not give its answer: the server refused it, or no answer came.
 */
export class DraftRequestFailed extends Error {}

async function request<T>(url: string, init: RequestInit): Promise<T> {
    let response: Response;

    try {
        response = await fetch(url, {
            credentials: 'same-origin',
            ...init,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': xsrfToken(),
            },
        });
    } catch {
        throw new DraftRequestFailed('lost');
    }

    if (!response.ok) {
        throw new DraftRequestFailed(String(response.status));
    }

    return (await response.json()) as T;
}

/**
 * The questions the draft producer of a noun asks.
 */
export function readQuestions(noun: string): Promise<DraftQuestionsData> {
    return request<DraftQuestionsData>(draftQuestions(noun).url, { method: 'GET' });
}

/**
 * The record the draft producer of a noun makes from the answers; nothing is saved.
 */
export function draftFrom(noun: string, answers: string[]): Promise<DraftedRecordData> {
    return request<DraftedRecordData>(draftRecord(noun).url, { method: 'POST', body: JSON.stringify({ answers }) });
}
