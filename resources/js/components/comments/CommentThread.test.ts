// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { reactive } from 'vue';

type PostOptions = {
    onNetworkError?: () => boolean;
    onHttpException?: (response: { status: number }) => boolean;
    onSuccess?: () => void;
};

const posts: { fields: Record<string, unknown>; options: PostOptions }[] = [];

vi.mock('@inertiajs/vue3', () => ({
    useForm: (fields: Record<string, unknown>) => {
        let transform = (value: Record<string, unknown>) => value;
        const form = reactive({
            ...fields,
            errors: {},
            processing: false,
            wasSuccessful: false,
            hasErrors: false,
            reset(name: string) {
                (form as Record<string, unknown>)[name] = '';
            },
            transform(callback: (value: Record<string, unknown>) => Record<string, unknown>) {
                transform = callback;

                return form;
            },
            post(_url: string, options: PostOptions) {
                const { target, body, submission_key } = form as unknown as Record<string, unknown>;
                posts.push({ fields: transform({ target, body, submission_key }), options });
            },
        });

        return form;
    },
    router: {
        post: (_url: string, fields: Record<string, unknown>, options: PostOptions) => posts.push({ fields, options }),
        reload: vi.fn(),
    },
}));
vi.mock('@/routes/comments', () => ({ post: { url: () => '/comments' } }));
vi.mock('@/composables/usePageChanges', () => ({ formSendingHooks: () => ({ onStart: () => {}, onFinish: () => {} }) }));
vi.mock('@/components/text/SourcePane.vue', () => ({ default: { template: '<div />' } }));

const { default: CommentComposer } = await import('./CommentComposer.vue');
const { commentThreadOf } = await import('./commentThreads');

function composer(pane: string) {
    return mount(CommentComposer, { props: { target: 'task 31', thread: commentThreadOf(pane, 'task 31') } });
}

beforeEach(() => {
    posts.length = 0;
});

describe('CommentComposer with a pane thread', () => {
    it('freezes a post whose answer is lost and keeps the text editable', async () => {
        const view = composer('pane-lost');
        await view.get('textarea').setValue('Is the schema settled?');
        await view.get('form').trigger('submit');

        expect(posts[0].options.onNetworkError?.()).toBe(false);
        await view.vm.$nextTick();

        const thread = commentThreadOf('pane-lost', 'task 31');
        expect(thread.attempt?.fields).toMatchObject({ body: 'Is the schema settled?' });
        expect(view.text()).toContain('Outcome unknown');
        expect((view.get('textarea').element as HTMLTextAreaElement).value).toBe('Is the schema settled?');
        expect(view.get('button[type="submit"]').attributes('disabled')).toBeDefined();
    });

    it('checks the lost post by replaying it under the same key once, then offers Send as new comment', async () => {
        const view = composer('pane-check');
        await view.get('textarea').setValue('Check me.');
        await view.get('form').trigger('submit');
        posts[0].options.onNetworkError?.();
        await view.vm.$nextTick();
        const key = posts[0].fields.submission_key;

        await view.findAll('button').find((button) => button.text() === 'Check comment')?.trigger('click');

        expect(posts).toHaveLength(2);
        expect(posts[1].fields.submission_key).toBe(key);
        posts[1].options.onSuccess?.();
        await view.vm.$nextTick();

        const thread = commentThreadOf('pane-check', 'task 31');
        expect(thread.attempt).toBeNull();
        expect(thread.draft.key).not.toBe(key);
        expect(view.get('button[type="submit"]').text()).toBe('Send as new comment');
    });

    it('keeps the draft across a redraw and keeps separate drafts in two panes', async () => {
        const first = composer('pane-a');
        await first.get('textarea').setValue('Draft in pane A.');
        first.unmount();

        const again = composer('pane-a');
        const other = composer('pane-b');

        expect((again.get('textarea').element as HTMLTextAreaElement).value).toBe('Draft in pane A.');
        expect((other.get('textarea').element as HTMLTextAreaElement).value).toBe('');
    });

    it('clears the draft, the attempt and the key on a 403', async () => {
        const view = composer('pane-denied');
        await view.get('textarea').setValue('Sneaking in.');
        await view.get('form').trigger('submit');
        const key = commentThreadOf('pane-denied', 'task 31').draft.key;

        posts[0].options.onHttpException?.({ status: 403 });
        await view.vm.$nextTick();

        const thread = commentThreadOf('pane-denied', 'task 31');
        expect([thread.draft.body, thread.attempt]).toEqual(['', null]);
        expect(thread.draft.key).not.toBe(key);
        expect((view.get('textarea').element as HTMLTextAreaElement).value).toBe('');
    });

    it('still posts as before without a thread', async () => {
        const view = mount(CommentComposer, { props: { target: 'doc 12' } });
        await view.get('textarea').setValue('About the document.');
        await view.get('form').trigger('submit');

        expect(posts[0].fields).toMatchObject({ target: 'doc 12', body: 'About the document.' });
        expect(view.text()).not.toContain('Outcome unknown');
    });
});
