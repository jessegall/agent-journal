// Where the Comment button sits over a selection, in the field's own coordinates: centered on the part of the selection that can be seen, so a selection running past an edge of the field or of the window puts it in the middle of what is visible.
export function buttonSpot(selection, field, window) {
    const left = Math.max(selection.left, field.left, 0);
    const right = Math.min(selection.right, field.right, window.width);
    const top = Math.max(selection.top, field.top, 0);
    return {x: (left + right) / 2 - field.left, y: top - field.top};
}
