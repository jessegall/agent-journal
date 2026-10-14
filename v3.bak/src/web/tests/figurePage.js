// words drawn on the page at each of `boxes`, and the controls `controls`, each {box, shown}: the page answers where a point falls on a
// word the way a browser's caret lookup does
export const write = (boxes, controls = []) => {
    globalThis.Node = {TEXT_NODE: 3};
    const inside = (box, x, y) => x >= box.left && x <= box.right && y >= box.top && y <= box.bottom;
    const text = (box) => ({nodeType: 3, data: "word", length: 4, parentElement: {checkVisibility: () => true}, box});
    document.caretRangeFromPoint = (x, y) => {
        const box = boxes.find((each) => inside(each, x, y));
        return box ? {startContainer: text(box), startOffset: 1} : null;
    };
    document.createRange = () => {
        const range = {setStart: (node) => (range.node = node), setEnd: () => {}, getClientRects: () => [range.node.box]};
        return range;
    };
    document.querySelectorAll = () =>
        controls.map(({box, shown}) => ({getBoundingClientRect: () => ({...box, width: 1, height: 1}), checkVisibility: () => shown}));
};
