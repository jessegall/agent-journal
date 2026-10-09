const sameRefs = (one, other) => JSON.stringify(one || []) === JSON.stringify(other || []);

export const answers = (real, placeholder) =>
    real.n > 0 && real.type === placeholder.type && sameRefs(real.refs, placeholder.refs) && Object.entries(placeholder.data || {}).every(([key, value]) => real.data?.[key] === value);

export const withoutAnswered = (held, incoming) => held.filter((row) => row.n !== 0 || !incoming.some((real) => answers(real, row)));
