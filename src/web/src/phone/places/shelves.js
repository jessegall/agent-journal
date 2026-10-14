export const LOOSE = "loose";

export const holding = (collections, docs) => {
    const refs = new Set(docs.map((doc) => doc.ref));
    return collections
        .map((one) => ({ref: one.ref, title: one.title, holds: one.refs.filter((ref) => refs.has(ref))}))
        .filter((one) => one.holds.length);
};

export function onShelf(shelf, shelves) {
    if (!shelf) return () => true;
    const held = new Set(shelf === LOOSE ? shelves.flatMap((one) => one.holds) : shelves.find((one) => one.ref === shelf)?.holds || []);
    return shelf === LOOSE ? (doc) => !held.has(doc.ref) : (doc) => held.has(doc.ref);
}
