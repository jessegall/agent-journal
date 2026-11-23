/**
 * The comparison of two captures of a screen, one from the design and one from the app: the texts the app shows
 * swapped for the design's words, the elements of both sides paired by what they say, the measurements of each pair
 * that differ, and the areas of the screen whose pixels differ, as boxes.
 */

/** One element as a capture records it: what it says, what it is, where it sits and how it is drawn. */
export type CapturedElement = {
    text: string;
    role: string;
    x: number;
    y: number;
    width: number;
    height: number;
    style: Record<string, string>;
};

/** One measurement of a pair that differs: which element, what was measured, and the two values. */
export type Difference = {
    text: string;
    role: string;
    measure: string;
    design: string;
    app: string;
};

/** A rectangle of the screen, in pixels from its top left corner. */
export type Box = { x: number; y: number; width: number; height: number };

/** How far apart two positions or sizes may be, in pixels, before they count as different. */
export const PIXEL_TOLERANCE = 3;

/** The texts that hold no words, which no element is paired by, and the name of a box that holds none. */
const BLANK = /^\s*(\[[^\]]*\]\s*)?$/;

/**
 * The text with each label the map names replaced by the design's word for it: a whole text that matches is
 * replaced, keeping the spaces around it, and any other text is left as it is.
 */
export function swapLabel(text: string, labels: Record<string, string>): string {
    const words = text.trim();
    const replacement = labels[words];

    if (words === '' || replacement === undefined) {
        return text;
    }

    return text.replace(words, replacement);
}

/** The text an element is paired by: its words with the spaces between them made single. */
export function pairingTextOf(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
}

/**
 * The elements of both sides paired by what they say, in the order each side shows them: the first design element
 * saying a text pairs with the first app element saying it, the second with the second. Texts one side shows and the
 * other does not are listed apart.
 */
export function pairElements(
    design: CapturedElement[],
    app: CapturedElement[],
    pairing: 'text' | 'order' = 'text',
): { pairs: [CapturedElement, CapturedElement][]; onlyInDesign: CapturedElement[]; onlyInApp: CapturedElement[] } {
    if (pairing === 'order') {
        return pairInOrder(design, app);
    }

    const waiting = new Map<string, CapturedElement[]>();

    for (const element of app) {
        const text = pairingTextOf(element.text);

        if (BLANK.test(text)) {
            continue;
        }

        waiting.set(text, [...(waiting.get(text) ?? []), element]);
    }

    const pairs: [CapturedElement, CapturedElement][] = [];
    const onlyInDesign: CapturedElement[] = [];

    for (const element of design) {
        const text = pairingTextOf(element.text);

        if (BLANK.test(text)) {
            continue;
        }

        const match = waiting.get(text)?.shift();

        if (match === undefined) {
            onlyInDesign.push(element);
            continue;
        }

        pairs.push([element, match]);
    }

    return { pairs, onlyInDesign, onlyInApp: [...waiting.values()].flat() };
}

/**
 * The elements of both sides paired by their place instead of their words, for a part that shows other content on
 * each side, such as a list row: the first text with the first text and the first box with the first box, in the
 * order each side shows them.
 */
function pairInOrder(
    design: CapturedElement[],
    app: CapturedElement[],
): { pairs: [CapturedElement, CapturedElement][]; onlyInDesign: CapturedElement[]; onlyInApp: CapturedElement[] } {
    const kindOf = (element: CapturedElement): string => element.role === 'box' ? 'box' : element.role === 'part' ? 'part' : 'text';
    const pairs: [CapturedElement, CapturedElement][] = [];
    const onlyInDesign: CapturedElement[] = [];
    const onlyInApp: CapturedElement[] = [];

    for (const kind of ['part', 'text', 'box']) {
        const designOfKind = design.filter((element) => kindOf(element) === kind);
        const appOfKind = app.filter((element) => kindOf(element) === kind);

        designOfKind.forEach((element, index) => {
            if (index < appOfKind.length) {
                pairs.push([element, appOfKind[index]]);
            } else {
                onlyInDesign.push(element);
            }
        });
        onlyInApp.push(...appOfKind.slice(designOfKind.length));
    }

    return { pairs, onlyInDesign, onlyInApp };
}

/** The measurements of one pair that differ: position and size past the tolerance, and every drawn style. */
export function differencesOf(design: CapturedElement, app: CapturedElement): Difference[] {
    const differences: Difference[] = [];
    const add = (measure: string, designValue: string, appValue: string): void => {
        differences.push({ text: pairingTextOf(design.text), role: design.role, measure, design: designValue, app: appValue });
    };

    // Where an element sits from top to bottom follows from everything above it, so its height and the gap to the
    // element above it are compared instead of its distance from the top.
    for (const measure of ['x', 'width', 'height'] as const) {
        if (Math.abs(design[measure] - app[measure]) > PIXEL_TOLERANCE) {
            add(measure, `${Math.round(design[measure])}px`, `${Math.round(app[measure])}px`);
        }
    }

    for (const measure of new Set([...Object.keys(design.style), ...Object.keys(app.style)])) {
        const designValue = design.style[measure] ?? '';
        const appValue = app.style[measure] ?? '';

        if (designValue !== appValue) {
            add(measure, designValue, appValue);
        }
    }

    return differences;
}

/**
 * The areas whose pixels differ, as boxes: the screen is cut into square cells, a cell with more differing pixels
 * than the threshold is marked, and marked cells that touch are joined into one box.
 */
export function differingAreas(differs: (x: number, y: number) => boolean, width: number, height: number, cell = 16, threshold = 4): Box[] {
    const columns = Math.ceil(width / cell);
    const rows = Math.ceil(height / cell);
    const marked = new Uint8Array(columns * rows);

    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            let count = 0;

            for (let y = row * cell; y < Math.min(height, (row + 1) * cell); y++) {
                for (let x = column * cell; x < Math.min(width, (column + 1) * cell); x++) {
                    count += differs(x, y) ? 1 : 0;
                }
            }

            marked[row * columns + column] = count > threshold ? 1 : 0;
        }
    }

    const boxes: Box[] = [];

    for (let start = 0; start < marked.length; start++) {
        if (marked[start] !== 1) {
            continue;
        }

        const reached = [start];
        marked[start] = 2;
        let [left, top, right, bottom] = [columns, rows, 0, 0];

        while (reached.length > 0) {
            const index = reached.pop()!;
            const [column, row] = [index % columns, Math.floor(index / columns)];
            [left, top, right, bottom] = [Math.min(left, column), Math.min(top, row), Math.max(right, column), Math.max(bottom, row)];

            for (const [nextColumn, nextRow] of [[column - 1, row], [column + 1, row], [column, row - 1], [column, row + 1]]) {
                const next = nextRow * columns + nextColumn;

                if (nextColumn >= 0 && nextColumn < columns && nextRow >= 0 && nextRow < rows && marked[next] === 1) {
                    marked[next] = 2;
                    reached.push(next);
                }
            }
        }

        boxes.push({
            x: left * cell,
            y: top * cell,
            width: Math.min(width, (right + 1) * cell) - left * cell,
            height: Math.min(height, (bottom + 1) * cell) - top * cell,
        });
    }

    return boxes;
}

/**
 * The distance from each paired element to the nearest paired element above it, as the design draws it, compared
 * with the same distance in the app; a difference past the tolerance is listed.
 */
export function gapDifferences(pairs: [CapturedElement, CapturedElement][]): Difference[] {
    const differences: Difference[] = [];

    pairs.forEach(([design, app], index) => {
        const above = nearestAbove(pairs.map((pair) => pair[0]), index);

        if (above === undefined) {
            return;
        }

        const designGap = design.y - (pairs[above][0].y + pairs[above][0].height);
        const appGap = app.y - (pairs[above][1].y + pairs[above][1].height);

        if (Math.abs(designGap - appGap) > PIXEL_TOLERANCE) {
            differences.push({
                text: pairingTextOf(design.text),
                role: design.role,
                measure: `gap below "${pairingTextOf(pairs[above][0].text)}"`,
                design: `${Math.round(designGap)}px`,
                app: `${Math.round(appGap)}px`,
            });
        }
    });

    return differences;
}

/**
 * Edges and lines that line up on one side and not on the other: two elements whose left edges, right edges or
 * vertical centres meet within a pixel in the design but lie apart in the app, or the other way round.
 */
export function alignmentDifferences(pairs: [CapturedElement, CapturedElement][]): Difference[] {
    const lines: [string, (element: CapturedElement) => number][] = [
        ['left edge', (element) => element.x],
        ['right edge', (element) => element.x + element.width],
        ['line', (element) => element.y + element.height / 2],
    ];
    const differences: Difference[] = [];

    for (let first = 0; first < pairs.length; first++) {
        for (let second = first + 1; second < pairs.length; second++) {
            for (const [name, position] of lines) {
                const designApart = Math.abs(position(pairs[first][0]) - position(pairs[second][0]));
                const appApart = Math.abs(position(pairs[first][1]) - position(pairs[second][1]));
                const linedUpInDesign = designApart <= 1;
                const linedUpInApp = appApart <= 1;

                if (linedUpInDesign === linedUpInApp || Math.abs(designApart - appApart) <= PIXEL_TOLERANCE) {
                    continue;
                }

                differences.push({
                    text: pairingTextOf(pairs[first][0].text),
                    role: pairs[first][0].role,
                    measure: `${name} with "${pairingTextOf(pairs[second][0].text)}"`,
                    design: linedUpInDesign ? 'lined up' : `${Math.round(designApart)}px apart`,
                    app: linedUpInApp ? 'lined up' : `${Math.round(appApart)}px apart`,
                });
            }
        }
    }

    return differences;
}

/** The index of the element whose bottom lies nearest above the top of the element at the index given. */
function nearestAbove(elements: CapturedElement[], index: number): number | undefined {
    const top = elements[index].y;
    let nearest: number | undefined;

    elements.forEach((element, candidate) => {
        const bottom = element.y + element.height;

        if (candidate === index || bottom > top + 1) {
            return;
        }

        if (nearest === undefined || bottom > elements[nearest].y + elements[nearest].height) {
            nearest = candidate;
        }
    });

    return nearest;
}
