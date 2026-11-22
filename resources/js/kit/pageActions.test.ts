import { describe, expect, it, vi } from 'vitest';

type Options = Record<string, unknown> & {
    onStart: (visit: unknown) => void;
    onFinish: (visit: unknown) => void;
};

const visits: Array<{ url: string; options: Options }> = [];
const sending = { onStart: vi.fn(), onFinish: vi.fn() };

vi.mock('@inertiajs/vue3', () => ({
    router: {
        visit: (url: string, options: Options) => visits.push({ url, options }),
    },
}));
vi.mock('@kit/usePageChanges', () => ({ formSendingHooks: () => sending }));

const { sendPageAction } = await import('./pageActions');

describe('sendPageAction', () => {
    it('sends by the route method, reloads only the props named, keeps the scroll and the state, and holds page reads while out', () => {
        const ownStart = vi.fn();
        const ownFinish = vi.fn();

        sendPageAction(
            { url: '/settings/save', method: 'post' },
            { owner: 'Reviews' },
            { only: ['page'], onStart: ownStart, onFinish: ownFinish },
        );
        const { url, options } = visits[0];
        options.onStart({});
        options.onFinish({});

        expect(url).toBe('/settings/save');
        expect(options).toMatchObject({
            method: 'post',
            data: { owner: 'Reviews' },
            only: ['page'],
            preserveScroll: true,
            preserveState: true,
        });
        expect(sending.onStart).toHaveBeenCalledOnce();
        expect(sending.onFinish).toHaveBeenCalledOnce();
        expect(ownStart).toHaveBeenCalledOnce();
        expect(ownFinish).toHaveBeenCalledOnce();
    });
});
