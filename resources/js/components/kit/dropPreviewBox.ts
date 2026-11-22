export type DropTarget = 'center' | 'left' | 'right' | 'up' | 'down' | 'strip';

export type Box = { x: number; y: number; width: number; height: number };

/** The window kinds that dock with a larger share of Home than a plain window. */
export type DockedKind = 'window' | 'chat' | 'document' | 'terminal';

const STRIP_HEIGHT = 34;
const HOME_EDGE_SHARE = 0.3;
const HOME_EDGE_SHARE_FOR_CONTENT = 0.38;
const PANE_SPLIT_SHARE = 0.5;

/**
 * The one place that says how much of an area a drop takes: the centre takes the whole area, a strip takes 34px from
 * its top, a side of a pane takes half, and a side of Home takes 30% (38% for a chat, a document or a terminal).
 */
export function dropPreviewBox(area: Box, target: DropTarget, scope: 'pane' | 'home', kind: DockedKind): Box {
    if (target === 'center') {
        return area;
    }

    if (target === 'strip') {
        return { ...area, height: STRIP_HEIGHT };
    }

    const isContent = kind !== 'window';
    const share = scope === 'pane' ? PANE_SPLIT_SHARE : isContent ? HOME_EDGE_SHARE_FOR_CONTENT : HOME_EDGE_SHARE;
    const width = area.width * share;
    const height = area.height * share;

    return {
        left: { ...area, width },
        right: { ...area, x: area.x + area.width - width, width },
        up: { ...area, height },
        down: { ...area, y: area.y + area.height - height, height },
    }[target];
}
