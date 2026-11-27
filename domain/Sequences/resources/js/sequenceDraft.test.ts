import { describe, expect, it } from 'vitest';
import type { SequenceStepData } from '@generated/types/sequences';
import { canMove, emptyStep, errorsByStep, moveStep, moveTo, removeStep } from './sequenceDraft';

function step(id: string): SequenceStepData {
    return { id, title: `Step ${id}`, runsWhen: '', doneWhen: '' };
}

const steps = ['a', 'b', 'c'].map(step);
const ids = (list: SequenceStepData[]) => list.map((each) => each.id);

describe('the order of steps while they are edited', () => {
    it('starts a new step empty', () => {
        expect(emptyStep('x')).toEqual({ id: 'x', title: '', runsWhen: '', doneWhen: '' });
    });

    it('moves a step a place and refuses to move one past either end', () => {
        expect(ids(moveStep(steps, 'b', 'up'))).toEqual(['b', 'a', 'c']);
        expect(ids(moveStep(steps, 'b', 'down'))).toEqual(['a', 'c', 'b']);
        expect(canMove(steps, 'a', 'up')).toBe(false);
        expect(canMove(steps, 'c', 'down')).toBe(false);
        expect(moveStep(steps, 'a', 'up')).toBe(steps);
    });

    it('places a dragged step at the index it is dropped on', () => {
        expect(ids(moveTo(steps, 'a', 2))).toEqual(['b', 'c', 'a']);
        expect(ids(moveTo(steps, 'c', 0))).toEqual(['c', 'a', 'b']);
        expect(ids(moveTo(steps, 'b', 99))).toEqual(['a', 'c', 'b']);
    });

    it('sends the focus to the row now in the removed one place, the last row, or Add a step', () => {
        expect(removeStep(steps, 'b').focus).toEqual({ kind: 'step', id: 'c' });
        expect(removeStep(steps, 'c').focus).toEqual({ kind: 'step', id: 'b' });
        expect(removeStep([step('a')], 'a')).toEqual({ steps: [], focus: { kind: 'add' } });
    });
});

describe('the errors of a draft', () => {
    it('are set beside the step and field they name, the rest going to the draft', () => {
        const { byStep, others } = errorsByStep({
            'steps.a.title': 'Give the step a title',
            'steps.a.runs_when': 'Say when it runs',
            'steps.b.doneWhen': 'Say when it is done',
            name: 'Name it',
        });

        expect(byStep).toEqual({
            a: { title: 'Give the step a title', runsWhen: 'Say when it runs' },
            b: { doneWhen: 'Say when it is done' },
        });
        expect(others).toEqual(['Name it']);
    });
});
