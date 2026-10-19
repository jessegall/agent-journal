import {seconds} from "./row.js";

let made = 0;

// A row the viewer draws at once while the journal writes the real one: it has no id yet, and `same` names the fields the real
// one will have, by which it is known when it arrives.
export function pendingRow(table, same, row = {}) {
    made += 1;
    return {table, id: 0, key: `pending:${made}`, created_at: new Date().toISOString(), created_by: "user", pending: true, same, ...same, ...row};
}

const SAME_MOMENT = 60;
const afterIt = (real, placeholder) => seconds(real.created_at) >= seconds(placeholder.created_at) - SAME_MOMENT;

export const answers = (real, placeholder) =>
    real.id > 0 &&
    real.table === placeholder.table &&
    afterIt(real, placeholder) &&
    Object.entries(placeholder.same || {}).every(([key, value]) => JSON.stringify(real[key]) === JSON.stringify(value));

export const withoutAnswered = (held, incoming) => held.filter((row) => row.id !== 0 || !incoming.some((real) => answers(real, row)));
