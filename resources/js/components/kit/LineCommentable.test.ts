// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent } from 'vue';
import CodeLine from './CodeLine.vue';
import CommentBar from './CommentBar.vue';
import CommentThread from './CommentThread.vue';
import LineCommentable from './LineCommentable.vue';

const Harness = defineComponent({
    components: { CodeLine, CommentBar, CommentThread, LineCommentable },
    props: { commented: { type: Array, default: () => [] } },
    template: `
        <LineCommentable :line-count="4" :commented-lines="commented">
            <template #line="{ line, selected, cursor, commented: isCommented, pick, step, comment }">
                <CodeLine
                    :line="line"
                    :selected="selected"
                    :cursor="cursor"
                    :marker="isCommented ? 'comment' : undefined"
                    @pick="pick"
                    @step="step"
                    @comment="comment"
                >code {{ line }}</CodeLine>
            </template>
            <template #thread="{ line }">
                <CommentThread
                    author="You" name="Agent 1" :lines="'line ' + line" text="Why?" :is-sent="true" :replies="[]"
                />
            </template>
            <template #bar="{ from, to, close }">
                <CommentBar :from="from" :to="to" quote="code" @cancel="close" @send="close" />
            </template>
        </LineCommentable>
    `,
});

function mountLines(commented: number[] = []) {
    return mount(Harness, { attachTo: document.body, props: { commented } });
}

describe('LineCommentable', () => {
    it('gives every gutter a name and keeps only the cursor line in the tab order', () => {
        const view = mountLines();
        const gutters = view.findAll('[data-line] button');

        expect(gutters.map((gutter) => gutter.attributes('aria-label'))).toEqual(['Line 1', 'Line 2', 'Line 3', 'Line 4']);
        expect(gutters.map((gutter) => gutter.attributes('tabindex'))).toEqual(['0', '-1', '-1', '-1']);
        view.unmount();
    });

    it('selects a line by its gutter, extends with Shift, and offers the CommentButton', async () => {
        const view = mountLines();

        await view.get('[data-line="2"] button').trigger('click');
        await view.get('[data-line="4"] button').trigger('click', { shiftKey: true });

        const pressed = view.findAll('[data-line] button').map((gutter) => gutter.attributes('aria-pressed'));

        expect(pressed).toEqual(['false', 'true', 'true', 'true']);
        expect(view.find('button[aria-label="Comment on the selected lines"]').exists()).toBe(true);
        view.unmount();
    });

    it('moves the line cursor with Up and Down, and extends the selection with Shift', async () => {
        const view = mountLines();

        await view.get('[data-line="1"] button').trigger('keydown', { key: 'ArrowDown', shiftKey: true });
        await view.get('[data-line="2"] button').trigger('keydown', { key: 'ArrowDown', shiftKey: true });

        const pressed = view.findAll('[data-line] button').map((gutter) => gutter.attributes('aria-pressed'));

        expect(pressed).toEqual(['true', 'true', 'true', 'false']);
        expect(document.activeElement).toBe(view.get('[data-line="3"] button').element);

        await view.get('[data-line="3"] button').trigger('keydown', { key: 'ArrowUp' });
        expect(document.activeElement).toBe(view.get('[data-line="2"] button').element);
        view.unmount();
    });

    it('opens the CommentBar under the last selected line with C, and closes it with Escape', async () => {
        const view = mountLines();

        await view.get('[data-line="1"] button').trigger('keydown', { key: 'ArrowDown', shiftKey: true });
        await view.get('[data-line="2"] button').trigger('keydown', { key: 'c' });

        const bar = view.get('[role="group"][aria-label="Comment on lines 1–2"]');

        expect(view.get('[data-line="2"]').element.nextElementSibling?.contains(bar.element) ?? false).toBe(true);

        await bar.get('textarea').trigger('keydown', { key: 'Escape' });
        expect(view.find('[role="group"][aria-label="Comment on lines 1–2"]').exists()).toBe(false);
        view.unmount();
    });

    it('sends from the bar with Control and Enter only when there is text', async () => {
        const view = mountLines();

        await view.get('[data-line="1"] button').trigger('keydown', { key: 'c' });

        const bar = view.get('[role="group"][aria-label="Comment on line 1"]');
        const textarea = bar.get('textarea');

        await textarea.trigger('keydown', { key: 'Enter', ctrlKey: true });
        expect(view.find('[role="group"][aria-label="Comment on line 1"]').exists()).toBe(true);

        await textarea.setValue('A question');
        await textarea.trigger('keydown', { key: 'Enter', ctrlKey: true });
        expect(view.find('[role="group"][aria-label="Comment on line 1"]').exists()).toBe(false);
        view.unmount();
    });

    it('comments on the whole document from its own button', async () => {
        const view = mountLines();

        await view.get('button:not([aria-label])').trigger('click');

        expect(view.find('[role="group"][aria-label="Comment on lines 1–4"]').exists()).toBe(true);
        view.unmount();
    });

    it('draws a thread under a commented line, labelled as a group', () => {
        const view = mountLines([3]);
        const thread = view.get('[role="group"][aria-label="Comment on line 3"]');

        expect(view.get('[data-line="3"]').element.nextElementSibling?.contains(thread.element)).toBe(true);
        expect(thread.text()).toContain('Read by Agent 1');
        view.unmount();
    });
});
