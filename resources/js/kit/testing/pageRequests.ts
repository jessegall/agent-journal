/// <reference types="node" />
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, vi } from 'vitest';
import { reactive } from 'vue';

/**
 * The ids every recorded request names, one for each record a route or a body points at; the server's replay
 * (tests/Feature/Web/PageRequestContractTest.php) makes each record and puts its real id in their place.
 */
export const RECORDED = {
    agent: '01JPAGEREQUESTAGENT0000000',
    inbox: '01JPAGEREQUESTINBOX0000000',
    message: '01JPAGEREQUESTMESSAGE00000',
    member: '01JPAGEREQUESTMEMBER000000',
    account: '01JPAGEREQUESTACCOUNT00000',
    candidate: '01JPAGEREQUESTCANDIDATE000',
    question: '01JPAGEREQUESTQUESTION0000',
    attempt: '01JPAGEREQUESTATTEMPT00000',
} as const;

export const CONTRACTS = 'tests/Contracts/page-requests';

// as names who sends it when it is not the owner, such as a member leaving a chat.
export type SentRequest = { method: string; url: string; body: unknown; headers?: Record<string, string>; as?: 'member' };

// The options of an Inertia visit the record keeps: the headers it adds, such as the Idempotency-Key of a keyed post.
type VisitOptions = { headers?: Record<string, string> };

/**
 * Stands in for the browser's fetch: keeps each request as sent and answers with the next answer given.
 */
export function browser(...answers: unknown[]): SentRequest[] {
    const sent: SentRequest[] = [];
    vi.stubGlobal('fetch', async (url: string, init: RequestInit) => {
        sent.push({ method: String(init.method), url, body: init.body === undefined ? null : JSON.parse(String(init.body)) });

        return new Response(JSON.stringify(answers.shift() ?? {}), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    });

    return sent;
}

type FormRoute = { url: string; method: string };

/**
 * Stands in for Inertia's router and useForm, for a vi.mock of @inertiajs/vue3: each post and each form submit is
 * kept as Inertia sends it, the form's fields, or what its transform makes of them, as the body.
 */
export function recordingInertia(sent: SentRequest[]) {
    return {
        usePage: () => ({ props: { viewer: { type: 'owner', id: 'owner', canShare: true } } }),
        router: {
            post: (url: string, body: unknown, options: VisitOptions = {}) =>
                sent.push({ method: 'POST', url, body: body ?? null, headers: options.headers ?? {} }),
            on: () => () => undefined,
            reload: () => undefined,
        },
        useForm: <Fields extends Record<string, unknown>>(fields: Fields) => {
            const names = Object.keys(fields);
            const form = reactive({
                ...fields,
                errors: {} as Record<string, string>,
                processing: false,
                clearErrors: () => undefined,
                transform: (shape: (data: Record<string, unknown>) => unknown) => {
                    body = () => shape(current());

                    return form;
                },
                optimistic: () => form,
                // a route helper's { url, method } and options, or a layout form's method, url and options
                submit: (route: FormRoute | string, ...rest: unknown[]) => {
                    const [method, url, options] = typeof route === 'string'
                        ? [route, rest[0] as string, (rest[1] ?? {}) as VisitOptions]
                        : [route.method, route.url, (rest[0] ?? {}) as VisitOptions];

                    sent.push({ method: method.toUpperCase(), url, body: body(), headers: options.headers ?? {} });
                },
                reset: () => undefined,
                defaults: () => form,
                data: () => current(),
            });
            const current = () => Object.fromEntries(names.map((name) => [name, (form as Record<string, unknown>)[name]]));
            let body: () => unknown = current;

            return form;
        },
    };
}

/**
 * Holds the request to its contract file, which the server's test replays against the real route; a missing file is
 * written, and UPDATE_CONTRACTS=1 writes it anew after a change that is meant.
 */
export function holdsContract(name: string, request: SentRequest | undefined): void {
    const path = join(CONTRACTS, `${name}.json`);
    const json = JSON.stringify(request, null, 4) + '\n';

    if (process.env.UPDATE_CONTRACTS === '1' || !existsSync(path)) {
        writeFileSync(path, json);
    }

    expect(JSON.parse(readFileSync(path, 'utf8'))).toStrictEqual(request);
}
