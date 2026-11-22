import { describe, expect, it } from 'vitest';
import {
    arrangementFrom,
    bringToFront,
    changeDetached,
    DETACHED_SIZE,
    defaultArrangement,
    detachWindow,
    dockWindow,
    dropWindow,
    firstWindowOnly,
    floatNewWindow,
    shownWindows,
} from './arrangement';
import type { DropTarget } from './arrangement';
import { pane, panesIn, windowsIn, zoneAt } from './paneLayout';

const screen = { width: 1440, height: 900 };
const home = () => defaultArrangement('chat', ['plans', 'rules']);

describe('dropping a dragged window', () => {
    const missingPane = 'closed-pane';
    const missingTargets: DropTarget[] = [
        { paneId: missingPane, zone: 'tabs', place: 0 },
        { paneId: missingPane, zone: 'centre' },
        { paneId: missingPane, zone: 'left' },
        { paneId: missingPane, zone: 'right' },
        { paneId: missingPane, zone: 'above' },
        { paneId: missingPane, zone: 'below' },
    ];

    it.each(missingTargets)(
        'keeps docked and floating windows when a $zone drop misses its pane',
        (target) => {
            const docked = home();
            const floating = detachWindow(
                docked,
                'rules',
                { left: 100, top: 100 },
                screen,
            );

            expect(dropWindow(docked, 'rules', target)).toBe(docked);
            expect(dropWindow(floating, 'rules', target)).toBe(floating);
        },
    );

    it('lands among the tabs at the place it was let go', () => {
        const dropped = dropWindow(home(), 'chat', {
            paneId: 'pane-windows',
            zone: 'tabs',
            place: 1,
        });

        expect(panesIn(dropped.grid).map((each) => each.windows)).toEqual([
            [],
            ['plans', 'chat', 'rules'],
        ]);
    });

    it('splits the pane on the side it aimed at, the new half first on the left and above', () => {
        const left = dropWindow(home(), 'rules', {
            paneId: 'pane-chat',
            zone: 'left',
        });
        const below = dropWindow(home(), 'rules', {
            paneId: 'pane-chat',
            zone: 'below',
        });

        expect(panesIn(left.grid).map((each) => each.windows)).toEqual([
            ['rules'],
            ['chat'],
            ['plans'],
        ]);
        expect(panesIn(below.grid).map((each) => each.windows)).toEqual([
            ['chat'],
            ['rules'],
            ['plans'],
        ]);
    });

    it('stops a detached window floating when it lands in a pane', () => {
        const detached = detachWindow(
            home(),
            'rules',
            { left: 100, top: 100 },
            screen,
        );
        const dropped = dropWindow(detached, 'rules', {
            paneId: 'pane-chat',
            zone: 'centre',
        });

        expect(dropped.detached).toEqual([]);
        expect(panesIn(dropped.grid)[0].windows).toEqual(['chat', 'rules']);
    });
});

describe('a drop zone', () => {
    const box = { left: 0, top: 0, width: 400, height: 434 };

    it('is the centre over the tab strip and on an empty pane', () => {
        expect(zoneAt(box, 10, 20, true)).toBe('centre');
        expect(zoneAt(box, 10, 300, false)).toBe('centre');
    });

    it('is the nearest side within a quarter of the pane, else the centre', () => {
        expect(zoneAt(box, 20, 234, true)).toBe('left');
        expect(zoneAt(box, 390, 234, true)).toBe('right');
        expect(zoneAt(box, 200, 50, true)).toBe('above');
        expect(zoneAt(box, 200, 430, true)).toBe('below');
        expect(zoneAt(box, 200, 234, true)).toBe('centre');
    });
});

describe('detached windows', () => {
    it('float at version 5 size on top and leave the grid', () => {
        const detached = detachWindow(
            home(),
            'plans',
            { left: 80, top: 80 },
            screen,
        );

        expect(detached.detached).toEqual([
            {
                key: 'plans',
                left: 80,
                top: 80,
                width: DETACHED_SIZE.width,
                height: DETACHED_SIZE.height,
                isMinimised: false,
            },
        ]);
        expect(shownWindows(detached)).toEqual(['chat', 'rules', 'plans']);
    });

    it('keep at least 48 px of their bar on screen and their smallest size', () => {
        const detached = detachWindow(
            home(),
            'plans',
            { left: 80, top: 80 },
            screen,
        );
        const moved = changeDetached(
            detached,
            'plans',
            { left: 5000, top: -200, width: 10, height: 10 },
            screen,
        );

        expect(moved.detached[0]).toMatchObject({
            left: 1392,
            top: 0,
            width: 260,
            height: 180,
        });
    });

    it('come to the front when clicked', () => {
        const two = detachWindow(
            detachWindow(home(), 'plans', { left: 80, top: 80 }, screen),
            'rules',
            { left: 120, top: 120 },
            screen,
        );

        expect(
            bringToFront(two, 'plans').detached.map((each) => each.key),
        ).toEqual(['rules', 'plans']);
    });

    it('dock into the only pane when it is empty, else into a new pane at the right', () => {
        const alone = detachWindow(
            firstWindowOnly('chat'),
            'chat',
            { left: 80, top: 80 },
            screen,
        );
        const docked = dockWindow(home(), 'plans');

        expect(
            panesIn(dockWindow(alone, 'chat').grid).map((each) => each.windows),
        ).toEqual([['chat']]);
        expect(panesIn(docked.grid).map((each) => each.windows)).toEqual([
            ['chat'],
            ['rules'],
            ['plans'],
        ]);
    });
});

describe('a stored or imported arrangement', () => {
    it('keeps a stored copy of a window that is still there and drops a copy of one that is gone', () => {
        const stored = {
            grid: pane(
                ['chat', 'plans~a1b2c3d4e5f6', 'gone~0f0f0f0f0f0f'],
                'pane-1',
            ),
            detached: [],
        };

        const applied = arrangementFrom(stored, ['chat', 'plans']);

        expect(applied && windowsIn(applied.grid)).toEqual([
            'chat',
            'plans~a1b2c3d4e5f6',
        ]);
    });

    it('leaves out windows Home no longer has', () => {
        const stored = detachWindow(
            home(),
            'rules',
            { left: 80, top: 80 },
            screen,
        );
        const applied = arrangementFrom(stored, ['chat', 'plans']);

        expect(applied?.detached).toEqual([]);
        expect(shownWindows(applied ?? home())).toEqual(['chat', 'plans']);
    });

    it('refuses what is not an arrangement', () => {
        expect(
            arrangementFrom({ grid: { type: 'pane' }, detached: [] }, ['chat']),
        ).toBeNull();
        expect(arrangementFrom('layout', ['chat'])).toBeNull();
        expect(
            arrangementFrom({ grid: home().grid, detached: [{ key: 'x' }] }, [
                'chat',
            ]),
        ).toBeNull();
    });
});

describe('day one and a first window', () => {
    it('starts with the chat alone at the reading width, and a window added floats at the desk top right, the next a step in', () => {
        const desk = { top: 124, right: screen.width };
        const dayOne = firstWindowOnly('chat');
        const first = floatNewWindow(dayOne, 'tasks', screen, desk);
        const second = floatNewWindow(first, 'plans', screen, desk);

        expect(panesIn(dayOne.grid)).toMatchObject([
            { windows: ['chat'], limitWidth: true },
        ]);
        expect(first.detached).toMatchObject([
            { key: 'tasks', top: desk.top + 24, isMinimised: false },
        ]);
        expect(first.detached[0].left + first.detached[0].width).toBe(
            desk.right - 24,
        );
        expect(second.detached[1].top - first.detached[0].top).toBe(24);
        expect(windowsIn(second.grid)).toEqual(['chat']);
    });
});
