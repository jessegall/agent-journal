// @vitest-environment happy-dom
import { describe, it, vi } from 'vitest';
import { holdsContract, RECORDED } from '@kit/testing/pageRequests';
import type { SentRequest } from '@kit/testing/pageRequests';
import { ref } from 'vue';

const sent: SentRequest[] = vi.hoisted(() => []);

vi.mock('@inertiajs/vue3', async () => (await import('@kit/testing/pageRequests')).recordingInertia(sent));
vi.spyOn(crypto, 'randomUUID').mockReturnValue('00000000-0000-4000-8000-000000000001');

const { useAccountNaming } = await import('./accountNaming');
const { signInActions } = await import('./signInActions');

describe('the Inertia submits of the accounts, as the page sends them', () => {
    it('renames an account', () => {
        const naming = useAccountNaming(() => ({ id: RECORDED.account, label: 'Work', nameRevision: 1 }));
        naming.naming.label = 'Home';
        naming.save(() => undefined);

        holdsContract('account-rename', sent.at(-1));
    });

    it('starts a sign-in of a new account and of an account again', () => {
        const actions = signInActions(ref(undefined));
        actions.begin('claude-code', 'oauth');
        holdsContract('account-sign-in', sent.at(-1));

        actions.beginAgain(RECORDED.account);
        holdsContract('account-sign-in-again', sent.at(-1));
    });

    it('sends the code a sign-in waits for, and cancels a sign-in', () => {
        const actions = signInActions(ref(undefined));
        actions.answer.code = '123456';
        actions.send(RECORDED.attempt);
        holdsContract('account-sign-in-code', sent.at(-1));

        actions.cancel(RECORDED.attempt);
        holdsContract('account-sign-in-cancel', sent.at(-1));
    });
});
