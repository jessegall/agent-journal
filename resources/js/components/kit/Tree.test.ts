// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, ref } from 'vue';
import Tree from './Tree.vue';
import TreeItem from './TreeItem.vue';

const Harness = defineComponent({
    components: { Tree, TreeItem },
    setup() {
        const opened = ref(false);
        const openCount = ref(0);

        return { opened, openCount };
    },
    template: `
        <Tree label="Files">
            <TreeItem value="src" label="src" :level="1" icon="folder" folder v-model:expanded="opened" />
            <template v-if="opened">
                <TreeItem value="app" label="app.ts" :level="2" icon="file" @open="openCount++" />
            </template>
            <TreeItem value="readme" label="README" :level="1" icon="file" selected @open="openCount++" />
        </Tree>
    `,
});

function mountTree() {
    return mount(Harness, { attachTo: document.body });
}

describe('Tree', () => {
    it('is a tree of treeitems with their level, selection and, for a folder, expansion', () => {
        const view = mountTree();
        const rows = view.findAll('[role="treeitem"]');

        expect(view.get('[role="tree"]').attributes('aria-label')).toBe('Files');
        expect(rows.map((row) => row.attributes('aria-level'))).toEqual(['1', '1']);
        expect(rows.map((row) => row.attributes('aria-selected'))).toEqual(['false', 'true']);
        expect(rows[0].attributes('aria-expanded')).toBe('false');
        expect(rows[1].attributes('aria-expanded')).toBeUndefined();
        view.unmount();
    });

    it('keeps one item in the tab order, the selected one', () => {
        const view = mountTree();

        expect(view.findAll('[role="treeitem"]').map((row) => row.attributes('tabindex'))).toEqual(['-1', '0']);
        view.unmount();
    });

    it('walks with Down and Up and jumps with Home and End', async () => {
        const view = mountTree();
        const [folder, readme] = view.findAll('[role="treeitem"]');

        await folder.trigger('keydown', { key: 'ArrowDown' });
        expect(document.activeElement).toBe(readme.element);

        await readme.trigger('keydown', { key: 'ArrowUp' });
        expect(document.activeElement).toBe(folder.element);

        await folder.trigger('keydown', { key: 'End' });
        expect(document.activeElement).toBe(readme.element);

        await readme.trigger('keydown', { key: 'Home' });
        expect(document.activeElement).toBe(folder.element);
        view.unmount();
    });

    it('opens a folder with Right, then enters it; Left closes it, then goes to the parent', async () => {
        const view = mountTree();
        const folder = view.get('[data-key="src"]');

        await folder.trigger('keydown', { key: 'ArrowRight' });
        expect(folder.attributes('aria-expanded')).toBe('true');

        await folder.trigger('keydown', { key: 'ArrowRight' });
        const child = view.get('[data-key="app"]');
        expect(document.activeElement).toBe(child.element);

        await child.trigger('keydown', { key: 'ArrowLeft' });
        expect(document.activeElement).toBe(folder.element);

        await folder.trigger('keydown', { key: 'ArrowLeft' });
        expect(folder.attributes('aria-expanded')).toBe('false');
        view.unmount();
    });

    it('opens the item with Enter', async () => {
        const view = mountTree();

        await view.get('[data-key="readme"]').trigger('keydown', { key: 'Enter' });

        expect(view.vm.openCount).toBe(1);
        view.unmount();
    });
});
