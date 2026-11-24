/// <reference types="node" />
import type { TerminalFrameData, TerminalInterestData } from '@generated/types/core';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { browser, CONTRACTS, holdsContract, RECORDED } from '@kit/testing/pageRequests';
import type { SentRequest } from '@kit/testing/pageRequests';
import * as webRoutes from '@/routes/web';
import { TerminalSubscription } from './terminalSubscription';
import type { TerminalFailure } from './terminalSubscription';
import { terminalControlClientFor } from './useTerminalControl';
import { terminalClientFor } from './useTerminalController';

vi.mock('@/echo', () => ({ xsrfToken: () => 'xsrf-token' }));

const AGENT = RECORDED.agent;

async function settled(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 0));
}

const interest: TerminalInterestData = {
    viewId: 'interest-1',
    readInterestId: 'interest-1',
    runtimeId: 'runtime-1',
    intervalMs: 500,
    expiresInSeconds: 30,
    live: true,
};

const liveFrame = {
    state: 'live',
    identity: { sessionId: 'session-1', processGeneration: 1, epoch: 'epoch-1', stream: 'stream-1', privacyRevision: 0 },
    frame: { epoch: 'epoch-1', sequence: 3, stream: 'stream-1', rows: [], columns: 20, privacyRevision: 0 },
    receivedAt: '2026-11-24T12:00:00Z',
    liveForMs: 15_000,
} as unknown as TerminalFrameData;

afterEach(() => vi.unstubAllGlobals());

describe('the requests the terminal view sends, as the browser sends them', () => {
    it('opens its interest, reads its first frame and a held one, renews and closes', async () => {
        const sent = browser(interest, liveFrame, interest, liveFrame, null);
        const subscription = new TerminalSubscription(
            terminalClientFor(AGENT),
            () => 'request-1',
            () => 1_000,
            () => undefined,
            (failure) => failure as TerminalFailure,
        );

        subscription.open();
        await settled();
        await settled();
        subscription.renew();
        await settled();
        subscription.poll();
        await settled();
        subscription.stop();
        await settled();

        holdsContract('terminal-open', sent[0]);
        holdsContract('terminal-first-frame', sent[1]);
        holdsContract('terminal-renew', sent[2]);
        holdsContract('terminal-held-frame', sent[3]);
        holdsContract('terminal-close', sent[4]);
    });

    it('takes, uses and gives back control of the terminal', async () => {
        const sent = browser();
        const control = terminalControlClientFor(AGENT);

        await control.take('interest-1', 'take-1');
        await control.cancel('take-1');
        await control.renew('grant-1');
        await control.input('grant-1', { type: 'text', text: 'hello', enter: true }, 1, 0);
        await control.input('grant-1', { type: 'key', key: 'escape' }, 2, 0);
        await control.input('grant-1', { type: 'resize', rows: 40, columns: 120 }, 3, 0);
        await control.choose('grant-1', 'send', 4);
        await control.check('grant-1');
        await control.openPrivate('grant-1', 5);
        await control.submitPrivate('grant-1', 'submission-1', 'secret', 6);
        await control.cancelPrivate('grant-1');
        await control.release('grant-1');
        await control.receipt('take-1', 7);

        const names = ['take', 'cancel-take', 'renew', 'text-input', 'key-input', 'resize-input', 'choose-draft',
            'check-screen', 'open-private', 'submit-private', 'cancel-private', 'release', 'receipt'];
        names.forEach((name, at) => holdsContract(`terminal-control-${name}`, sent[at]));
    });
});

/**
 * Every script file of the shell and of every domain, generated code left out.
 */
function scriptFiles(folder: string): string[] {
    return readdirSync(folder).flatMap((name) => {
        const path = join(folder, name);

        if (statSync(path).isDirectory()) {
            return ['generated', 'routes', 'actions', 'wayfinder', 'node_modules'].includes(name) ? [] : scriptFiles(path);
        }

        return /\.(ts|vue)$/.test(name) && !name.endsWith('.test.ts') ? [path] : [];
    });
}

describe('the contract files', () => {
    it('cover every route the frontend reaches with getJson or postJson', () => {
        const folders = ['resources/js', ...readdirSync('domain').map((name) => `domain/${name}/resources/js`)];
        const called = new Set(folders.filter(existsSync).flatMap(scriptFiles).flatMap((file) => [
            ...readFileSync(file, 'utf8').matchAll(/\b(?:getJson|postJson)(?:<[^>]*>)?\(\s*([A-Za-z]+)\.url\(/g),
        ].map((call) => call[1])));
        const recorded = readdirSync(CONTRACTS).map(
            (file) => (JSON.parse(readFileSync(join(CONTRACTS, file), 'utf8')) as SentRequest).url.split('?')[0],
        );
        const routes = webRoutes as unknown as Record<string, { definition: { url: string } }>;

        const uncovered = [...called].filter((helper) => {
            const address = new RegExp('^' + routes[helper].definition.url.replace(/\{[^}]+\}/g, '[^/]+') + '$');

            return !recorded.some((url) => address.test(url));
        });

        expect(uncovered).toStrictEqual([]);
    });
});
