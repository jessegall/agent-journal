// The uint32 generator already used by figureWork.test.js, restored as the shared deterministic test helper.
export const seeded = (initial) => {
    let seed = Math.trunc(initial) >>> 0;
    return () => (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296;
};
