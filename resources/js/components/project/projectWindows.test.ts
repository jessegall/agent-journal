// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CodeView from './CodeView.vue';
import ProjectTree from './ProjectTree.vue';

const entries = [
    { path: 'app', name: 'app', isFolder: true, children: [{ path: 'app/main.ts', name: 'main.ts', isFolder: false }] },
    { path: 'readme.md', name: 'readme.md', isFolder: false },
];

describe('the project tree', () => {
    it('opens a folder with Right and a file with Enter, and closes the folder with Left', async () => {
        const view = mount(ProjectTree, { props: { entries, state: 'ready' }, attachTo: document.body });
        const rows = () => view.findAll('[role="treeitem"]');

        expect(rows()).toHaveLength(2);

        await rows()[0].trigger('keydown', { key: 'ArrowRight' });
        expect(rows()).toHaveLength(3);

        await rows()[1].trigger('keydown', { key: 'Enter' });
        expect(view.emitted('open')).toEqual([['app/main.ts']]);

        await rows()[0].trigger('keydown', { key: 'ArrowLeft' });
        expect(rows()).toHaveLength(2);
        view.unmount();
    });

    it('tells an empty project from a failed read, which offers Retry', async () => {
        const empty = mount(ProjectTree, { props: { entries: [], state: 'ready' } });
        const failed = mount(ProjectTree, { props: { entries: [], state: 'failed' } });

        expect(empty.text()).toContain('empty');
        expect(empty.find('button').exists()).toBe(false);
        expect(failed.find('[role="alert"]').exists()).toBe(true);

        await failed.get('button').trigger('click');
        expect(failed.emitted('retry')).toHaveLength(1);
    });
});

describe('the code view', () => {
    it('shows numbered lines with a theme menu, and Retry only in its own window when unreadable', async () => {
        const code = mount(CodeView, { props: { name: 'main.ts', lines: ['a', 'b'], isMarkdown: false, state: 'ready' } });

        expect(code.findAll('[data-line]')).toHaveLength(2);
        expect(code.find('[aria-haspopup="menu"]').text()).toContain('Dark');

        const failed = mount(CodeView, { props: { name: 'main.ts', lines: [], isMarkdown: false, state: 'failed' } });
        await failed.get('button').trigger('click');

        expect(failed.emitted('retry')).toHaveLength(1);
    });

    it('offers a Markdown file to the document reader instead of drawing it', async () => {
        const view = mount(CodeView, { props: { name: 'readme.md', lines: ['# x'], isMarkdown: true, state: 'ready' } });

        expect(view.findAll('[data-line]')).toHaveLength(0);

        await view.get('button').trigger('click');
        expect(view.emitted('openReader')).toHaveLength(1);
    });
});
