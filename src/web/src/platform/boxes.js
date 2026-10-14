export function boxAround(elements) {
    const boxes = elements.map((el) => el.getBoundingClientRect()).filter((r) => r.width > 4);
    if (!boxes.length) return null;
    return {
        l: Math.min(...boxes.map((r) => r.left)),
        t: Math.min(...boxes.map((r) => r.top)),
        r: Math.max(...boxes.map((r) => r.right)),
        b: Math.max(...boxes.map((r) => r.bottom)),
    };
}
