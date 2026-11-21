import { describe, expect, it, vi } from 'vitest';

type Options = Record<string, unknown> & {
    onSuccess: (page: { flash: Record<string, unknown> }) => void;
    onError: (errors: Record<string, string>) => void;
    onNetworkError: () => boolean;
};

const posts: Array<{ url: string; data: unknown; options: Options }> = [];

vi.mock('@inertiajs/vue3', () => ({
    router: {
        post: (url: string, data: unknown, options: Options) =>
            posts.push({ url, data, options }),
    },
}));

const { keyedPost } = await import('./keyedPost');

describe('keyedPost', () => {
    it('posts once under its key with no optimistic update and settles accepted, refused and uncertain', () => {
        const outcome = {
            onAccepted: vi.fn(),
            onRefused: vi.fn(),
            onUncertain: vi.fn(),
        };

        keyedPost('/chat/messages', { body: 'Hi' }, 'key-1', outcome, ['page']);
        const { options } = posts[0];
        options.onSuccess({ flash: {} });
        options.onError({ session: 'The agent now runs another session.' });
        const showsErrorModal = options.onNetworkError();

        expect(options).toMatchObject({
            async: true,
            only: ['page'],
            headers: { 'Idempotency-Key': 'key-1' },
        });
        expect(options.optimistic).toBeUndefined();
        expect(outcome.onAccepted).toHaveBeenCalledOnce();
        expect(outcome.onRefused).toHaveBeenCalledWith(
            'The agent now runs another session.',
            'session',
        );
        expect(outcome.onUncertain).toHaveBeenCalledOnce();
        expect(showsErrorModal).toBe(false);
    });
});
