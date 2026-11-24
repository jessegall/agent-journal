import { describe, expect, it } from 'vitest';
import {
    alignmentDifferences,
    type CapturedElement,
    differencesOf,
    differingAreas,
    gapDifferences,
    pairElements,
    swapLabel,
    unacceptedOnOneSide,
} from './comparison.ts';

function element(text: string, x: number, y: number, style: Record<string, string> = {}): CapturedElement {
    return { text, role: 'span', x, y, width: 100, height: 20, style };
}

describe('the design comparison', () => {
    it('swaps a whole app text for the design word and keeps its spaces', () => {
        const labels = { 'Connect a project': 'Open connected projects' };

        expect(swapLabel('  Connect a project ', labels)).toBe('  Open connected projects ');
        expect(swapLabel('Connect a project now', labels)).toBe('Connect a project now');
    });

    it('leaves out an element found on one side only that an accepted entry names for that side', () => {
        const accepted = new Set(['"Comments" (span) only in the app']);
        const found = [element('Comments', 0, 0), element('Help', 0, 30)];

        expect(unacceptedOnOneSide(found, accepted, 'app').map((kept) => kept.text)).toEqual(['Help']);
        expect(unacceptedOnOneSide(found, accepted, 'design').map((kept) => kept.text)).toEqual(['Comments', 'Help']);
    });

    it('pairs elements by what they say, in order, and lists the texts of one side only', () => {
        const design = [element('Name', 0, 0), element('Save', 0, 30), element('Save', 0, 60), element('Help', 0, 90)];
        const app = [element('Save', 0, 31), element('Name', 0, 0), element('Save', 0, 61), element('Extra', 0, 90)];

        const { pairs, onlyInDesign, onlyInApp } = pairElements(design, app);

        expect(pairs.map(([left, right]) => [left.y, right.y])).toEqual([[0, 0], [30, 31], [60, 61]]);
        expect(onlyInDesign.map((found) => found.text)).toEqual(['Help']);
        expect(onlyInApp.map((found) => found.text)).toEqual(['Extra']);
    });

    it('pairs by place when the two sides show other content', () => {
        const design = [element('Fix the login', 0, 0), element('Open', 0, 30)];
        const app = [element('Rename the plan', 0, 0), element('Open', 0, 30), element('Extra', 0, 60)];

        const { pairs, onlyInApp } = pairElements(design, app, 'order');

        expect(pairs.map(([left, right]) => [left.text, right.text])).toEqual([['Fix the login', 'Rename the plan'], ['Open', 'Open']]);
        expect(onlyInApp.map((found) => found.text)).toEqual(['Extra']);
    });

    it('leaves the distance from the top to the gaps and lists every style that differs', () => {
        const design = element('Name', 0, 0, { 'padding-left': '16px', color: 'rgb(0, 0, 0)' });
        const app = element('Name', 2, 10, { 'padding-left': '12px', color: 'rgb(0, 0, 0)' });

        expect(differencesOf(design, app).map((found) => [found.measure, found.design, found.app])).toEqual([
            ['padding-left', '16px', '12px'],
        ]);
    });

    it('compares the gap to the element above and the lines that meet', () => {
        const pairs: [CapturedElement, CapturedElement][] = [
            [element('Title', 0, 0), element('Title', 0, 0)],
            [element('Help', 0, 24), element('Help', 8, 40)],
        ];

        expect(gapDifferences(pairs).map((found) => [found.design, found.app])).toEqual([['4px', '20px']]);
        expect(alignmentDifferences(pairs).map((found) => [found.measure, found.design, found.app])).toContainEqual([
            'left edge with "Help"',
            'lined up',
            '8px apart',
        ]);
    });

    it('joins touching cells whose pixels differ into one box', () => {
        const differs = (x: number, y: number): boolean => x >= 16 && x < 48 && y < 16;

        expect(differingAreas(differs, 64, 32)).toEqual([{ x: 16, y: 0, width: 32, height: 16 }]);
    });
});
