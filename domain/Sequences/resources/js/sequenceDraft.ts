import type { SequenceStepData } from '@generated/types/sequences';

/**
 * The order of a sequence's steps while it is edited: adding, removing and moving return a new list and say where the
 * focus goes, so the editor only draws them.
 */
export type Direction = 'up' | 'down';

export type FocusAfter = { kind: 'step'; id: string } | { kind: 'add' };

export function emptyStep(id: string): SequenceStepData {
    return { id, title: '', runsWhen: '', doneWhen: '' };
}

export function canMove(steps: SequenceStepData[], id: string, direction: Direction): boolean {
    const index = steps.findIndex((step) => step.id === id);

    return index >= 0 && (direction === 'up' ? index > 0 : index < steps.length - 1);
}

/**
 * The steps with this one moved a place; unchanged when it is already at that end.
 */
export function moveStep(steps: SequenceStepData[], id: string, direction: Direction): SequenceStepData[] {
    if (!canMove(steps, id, direction)) {
        return steps;
    }

    const index = steps.findIndex((step) => step.id === id);

    return moveTo(steps, id, direction === 'up' ? index - 1 : index + 1);
}

/**
 * The steps with this one placed at the index, as a drag drops it.
 */
export function moveTo(steps: SequenceStepData[], id: string, target: number): SequenceStepData[] {
    const moved = steps.find((step) => step.id === id);

    if (moved === undefined) {
        return steps;
    }

    const others = steps.filter((step) => step.id !== id);
    const place = Math.max(0, Math.min(target, others.length));

    return [...others.slice(0, place), moved, ...others.slice(place)];
}

/**
 * The steps without this one, and where the focus goes: the row now in its place, else the last row, else Add a step.
 */
export function removeStep(steps: SequenceStepData[], id: string): { steps: SequenceStepData[]; focus: FocusAfter } {
    const index = steps.findIndex((step) => step.id === id);
    const remaining = steps.filter((step) => step.id !== id);
    const next = remaining[Math.min(index, remaining.length - 1)];

    return { steps: remaining, focus: next === undefined ? { kind: 'add' } : { kind: 'step', id: next.id } };
}

/**
 * The server's errors by step: a key such as steps.<id>.runs_when is the Runs when of that step, written as runsWhen;
 * anything else is the draft's.
 */
export function errorsByStep(errors: Record<string, string>): {
    byStep: Record<string, Record<string, string>>;
    others: string[];
} {
    const byStep: Record<string, Record<string, string>> = {};
    const others: string[] = [];

    for (const [key, message] of Object.entries(errors)) {
        const match = /^steps\.([^.]+)\.(\w+)$/.exec(key);

        if (match === null) {
            others.push(message);

            continue;
        }

        const field = match[2].replace(/_(\w)/g, (_, letter: string) => letter.toUpperCase());

        byStep[match[1]] = { ...byStep[match[1]], [field]: message };
    }

    return { byStep, others };
}
