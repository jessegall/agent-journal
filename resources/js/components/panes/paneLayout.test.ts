import { describe, expect, it } from 'vitest';
import {
    activate,
    closePane,
    closeWindow,
    copyIdOf,
    copyWindow,
    defaultLayout,
    moveWindow,
    originalKeyOf,
    paneBoxes,
    panesIn,
    settledRatio,
    splitPane,
    windowsIn,
} from './paneLayout';
import { designPresets } from './arrangement';
import type { LayoutNode, Split } from './paneLayout';

describe('the default layout', () => {
    it('puts the chat on the left and every other window as a tab on the right', () => {
        const layout = defaultLayout('chat', ['plans', 'rules']) as Split;

        expect(layout.type).toBe('split');
        expect(layout.axis).toBe('row');
        expect(windowsIn(layout.first)).toEqual(['chat']);
        expect(windowsIn(layout.second)).toEqual(['plans', 'rules']);
    });

    it('is a single pane when the chat is the only window', () => {
        expect(defaultLayout('chat', []).type).toBe('pane');
    });
});

describe('a splitter', () => {
    it('snaps to the middle within 14 pixels of it', () => {
        expect(settledRatio(0.51, 1000)).toBe(0.5);
        expect(settledRatio(0.52, 1000)).toBe(0.52);
    });

    it('never leaves a pane below 140 pixels', () => {
        expect(settledRatio(0.05, 1000)).toBeCloseTo(0.14);
        expect(settledRatio(0.99, 1000)).toBeCloseTo(0.86);
    });

    it('stays in the middle when the space cannot hold two smallest panes', () => {
        expect(settledRatio(0.2, 250)).toBe(0.5);
    });
});

describe('windows in panes', () => {
    it('opens a copy under a key of its own that keeps its window and its id when moved', () => {
        const layout = copyWindow(
            defaultLayout('chat', ['plans']),
            'plans',
            'pane-chat',
        );
        const copyKey = panesIn(layout).find(
            (each) => each.id === 'pane-chat',
        )!.active!;

        expect(windowsIn(layout)).toContain('plans');
        expect(originalKeyOf(copyKey)).toBe('plans');
        expect(copyIdOf(copyKey)).toMatch(/^[a-f0-9]{12}$/);
        expect(copyIdOf('plans')).toBeNull();

        const second = copyWindow(layout, 'plans', 'pane-chat');
        const copies = windowsIn(second).filter(
            (key) => copyIdOf(key) !== null,
        );
        expect(new Set(copies).size).toBe(2);

        const moved = moveWindow(
            second,
            copyKey,
            panesIn(second).find((each) => each.id !== 'pane-chat')!.id,
        );
        expect(windowsIn(moved)).toContain(copyKey);
    });

    it('moves a window into another pane as its active tab', () => {
        const layout = moveWindow(
            defaultLayout('chat', ['plans', 'rules']),
            'rules',
            'pane-chat',
        );
        const chatPane = panesIn(layout).find(
            (each) => each.id === 'pane-chat',
        );

        expect(chatPane?.windows).toEqual(['chat', 'rules']);
        expect(chatPane?.active).toBe('rules');
        expect(windowsIn(layout)).toEqual(['chat', 'rules', 'plans']);
    });

    it('splits a pane and puts the window in the new half', () => {
        const layout = splitPane(
            defaultLayout('chat', ['plans', 'rules']),
            'pane-windows',
            'rules',
            'below',
        );

        expect(panesIn(layout).map((each) => each.windows)).toEqual([
            ['chat'],
            ['plans'],
            ['rules'],
        ]);
    });

    it('keeps a pane whose last window closed, empty', () => {
        const layout = closeWindow(defaultLayout('chat', ['plans']), 'plans');

        expect(panesIn(layout).map((each) => each.windows)).toEqual([
            ['chat'],
            [],
        ]);
    });

    it('gives a closed pane its space to the other side', () => {
        const layout = closePane(
            defaultLayout('chat', ['plans']),
            'pane-windows',
        );

        expect(layout.type).toBe('pane');
        expect(windowsIn(layout)).toEqual(['chat']);
    });

    it('activates only a window the pane holds', () => {
        const layout = defaultLayout('chat', ['plans', 'rules']);

        expect(
            panesIn(activate(layout, 'pane-windows', 'rules'))[1].active,
        ).toBe('rules');
        expect(
            panesIn(activate(layout, 'pane-windows', 'chat'))[1].active,
        ).toBe('plans');
    });
});

describe('a layout thumbnail', () => {
    it('gives every pane its share of the grid', () => {
        const layout = splitPane(
            defaultLayout('chat', ['plans', 'rules']),
            'pane-windows',
            'rules',
            'below',
        );

        expect(
            paneBoxes(layout).map(({ left, top, width, height }) => [
                left,
                top,
                width,
                height,
            ]),
        ).toEqual([
            [0, 0, 0.5, 1],
            [0.5, 0, 0.5, 0.5],
            [0.5, 0.5, 0.5, 0.5],
        ]);
    });
});

describe('the design layouts', () => {
    const screen = { width: 1440, height: 900 };
    const shapeOf = (node: LayoutNode): unknown =>
        node.type === 'pane' ? node.windows : [node.axis, node.ratio, shapeOf(node.first), shapeOf(node.second)];

    it('builds Just the chat, A first window, Docked and Windows only from the windows in their declared order', () => {
        const presets = designPresets(['chat', 'plans', 'tasks', 'rules'], screen);
        const named = Object.fromEntries(presets.map((preset) => [preset.name, preset.arrangement]));

        expect(presets.map((preset) => preset.name)).toEqual(['Just the chat', 'A first window', 'Docked', 'Windows only']);
        expect(named['A first window'].detached.map((each) => each.key)).toEqual(['plans']);
        expect(shapeOf(named['Docked'].grid)).toEqual(['row', 0.64, ['chat'], ['column', 0.36, ['plans'], ['tasks']]]);
        expect(shapeOf(named['Windows only'].grid)).toEqual(['row', 0.55, ['plans'], ['column', 0.55, ['tasks'], ['rules']]]);
    });

    it('leaves out a window Home lacks, and a layout that would repeat an earlier one', () => {
        expect(designPresets(['chat'], screen).map((preset) => preset.name)).toEqual(['Just the chat']);
        expect(shapeOf(designPresets(['chat', 'plans'], screen)[2].arrangement.grid)).toEqual([
            'row',
            0.64,
            ['chat'],
            ['plans'],
        ]);
    });
});
