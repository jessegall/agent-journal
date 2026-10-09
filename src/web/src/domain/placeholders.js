let made = 0;

export function pendingRow(prefix, row) {
    made += 1;
    return {
        ref: `${prefix}${made}`,
        n: 0,
        title: "",
        abstract: "",
        brief: "",
        refs: [],
        seen: ["user"],
        sections: [],
        data: {},
        created: Date.now() / 1000,
        updated: 0,
        deleted: 0,
        completed: 0,
        who: "user",
        pending: true,
        ...row,
    };
}

const sameRefs = (one, other) => JSON.stringify(one || []) === JSON.stringify(other || []);

const SAME_MOMENT = 60;
const sameWords = (real, placeholder) => !placeholder.brief || real.brief === placeholder.brief;
const afterIt = (real, placeholder) => !placeholder.created || real.created >= placeholder.created - SAME_MOMENT;

export const answers = (real, placeholder) =>
    real.n > 0 &&
    real.type === placeholder.type &&
    sameRefs(real.refs, placeholder.refs) &&
    sameWords(real, placeholder) &&
    afterIt(real, placeholder) &&
    Object.entries(placeholder.data || {}).every(([key, value]) => real.data?.[key] === value);

export const withoutAnswered = (held, incoming) => held.filter((row) => row.n !== 0 || !incoming.some((real) => answers(real, row)));
