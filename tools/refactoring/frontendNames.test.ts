import { describe, expect, it } from 'vitest';
import { frontendNamesOf, reviewLine } from './frontendNames';

describe('frontendNamesOf', () => {
    it('names exported declarations alone and file-local ones with their file', () => {
        const source = [
            'export function usePanes() {}',
            'export type PaneId = string;',
            'const { width, height } = size();',
            'function clampWidth() {}',
        ].join('\n');

        expect(frontendNamesOf('resources/js/panes.ts', source).map(reviewLine)).toEqual([
            'function\tusePanes',
            'type\tPaneId',
            'variable\tpanes::width',
            'variable\tpanes::height',
            'function\tpanes::clampWidth',
        ]);
    });

    it('names a component by its file and its script names on their lines', () => {
        const source = ['<template><div /></template>', '<script setup lang="ts">', 'const open = ref(false);', '</script>'].join(
            '\n',
        );

        expect(frontendNamesOf('resources/js/Drawer.vue', source)).toEqual([
            { type: 'component', name: 'Drawer', line: 1 },
            { type: 'variable', name: 'Drawer::open', line: 3 },
        ]);
    });

    it('gives a new name a review line the reviewed list does not hold yet', () => {
        const reviewed = new Set(['function\tusePanes']);
        const lines = frontendNamesOf('resources/js/panes.ts', 'export function usePanes() {}\nexport const x2 = 1;').map(
            reviewLine,
        );

        expect(lines.filter((line) => !reviewed.has(line))).toEqual(['variable\tx2']);
    });
});
