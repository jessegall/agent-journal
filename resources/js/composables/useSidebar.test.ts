// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSidebar } from './useSidebar';

describe('folding the sidebar for a layout', () => {
    beforeEach(() => {
        vi.stubGlobal('matchMedia', () => ({ matches: false }));
    });

    it('folds an open sidebar to its mini form and leaves a folded one folded', () => {
        const sidebar = useSidebar();
        sidebar.isMini.value = false;

        sidebar.fold();
        expect(sidebar.isMini.value).toBe(true);

        sidebar.fold();
        expect(sidebar.isMini.value).toBe(true);
    });

    it('keeps a phone sidebar as it is', () => {
        vi.stubGlobal('matchMedia', () => ({ matches: true }));
        const sidebar = useSidebar();
        sidebar.isMini.value = false;

        sidebar.fold();
        expect(sidebar.isMini.value).toBe(false);
    });
});
