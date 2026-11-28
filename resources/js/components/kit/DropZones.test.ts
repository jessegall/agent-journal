// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { dropZoneTargetAt, dropZoneTargets } from './dropZoneTargets';
import DropZones from './DropZones.vue';

const center = { x: 200, y: 150 };

describe('dropZoneTargetAt', () => {
    it('aims at the centre, and at a side when the pointer is within 14px of the point 29px from the centre', () => {
        expect(dropZoneTargetAt({ x: 200, y: 150 }, center)).toBe('center');
        expect(dropZoneTargetAt({ x: 171, y: 150 }, center)).toBe('left');
        expect(dropZoneTargetAt({ x: 229, y: 150 }, center)).toBe('right');
        expect(dropZoneTargetAt({ x: 200, y: 121 }, center)).toBe('up');
        expect(dropZoneTargetAt({ x: 200, y: 179 }, center)).toBe('down');
        expect(dropZoneTargetAt({ x: 171 - 13, y: 150 }, center)).toBe('left');
    });

    it('aims at nothing beyond 14px of every point', () => {
        expect(dropZoneTargetAt({ x: 171 - 15, y: 150 }, center)).toBeNull();
        expect(dropZoneTargetAt({ x: 400, y: 400 }, center)).toBeNull();
    });

    it('gives every target a menu item, so each is reachable without a pointer', () => {
        expect(Object.values(dropZoneTargets).map((target) => target.menuLabel)).toEqual([
            'Join pane',
            'Dock left',
            'Dock right',
            'Dock top',
            'Dock bottom',
        ]);
    });
});

describe('DropZones', () => {
    it('draws five cells in a 3 by 3 grid of 26px with a gap of 3, centred on the pane, and hides them from assistive technology', () => {
        const view = mount(DropZones, { props: { center, pointer: { x: 0, y: 0 } } });

        expect(view.attributes('aria-hidden')).toBe('true');
        expect(view.findAll('[data-target]')).toHaveLength(5);
        expect(view.classes()).toEqual(expect.arrayContaining(['grid-cols-[repeat(3,26px)]', 'gap-0.75']));
        expect(view.attributes('style')).toContain('left: 158px');
        expect(view.attributes('style')).toContain('top: 108px');
    });

    it('fills the aimed cell with the brand colour and sends it through aim', async () => {
        const view = mount(DropZones, { props: { center, pointer: { x: 0, y: 0 } } });

        await view.setProps({ pointer: { x: 171, y: 150 } });

        expect(view.get('[data-target="left"]').classes()).toContain('bg-brand');
        expect(view.get('[data-target="right"]').classes()).toContain('bg-raised');
        expect(view.emitted('aim')?.at(-1)).toEqual(['left']);

        await view.setProps({ pointer: { x: 0, y: 0 } });

        expect(view.emitted('aim')?.at(-1)).toEqual([null]);
    });
});
