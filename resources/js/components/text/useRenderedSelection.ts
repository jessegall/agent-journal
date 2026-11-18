/**
 * The source lines a selection in rendered Markdown covers: the enclosing interval of the marked blocks its two ends
 * sit in. Rendered text cannot prove an exact quote, so this only ever proposes whole lines.
 */
export function renderedLineRange(selection: Selection | null): { firstLine: number; lastLine: number } | null {
    if (selection === null || selection.isCollapsed || selection.anchorNode === null || selection.focusNode === null) {
        return null;
    }

    const blocks = [markedBlockOf(selection.anchorNode), markedBlockOf(selection.focusNode)];

    if (blocks[0] === null || blocks[1] === null) {
        return null;
    }

    const firsts = blocks.map((block) => Number(block?.dataset.sourceFirst));
    const lasts = blocks.map((block) => Number(block?.dataset.sourceLast));

    return { firstLine: Math.min(...firsts), lastLine: Math.max(...lasts) };
}

function markedBlockOf(node: Node): HTMLElement | null {
    const element = node instanceof HTMLElement ? node : node.parentElement;

    return element?.closest<HTMLElement>('[data-source-first][data-source-last]') ?? null;
}
