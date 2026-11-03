import {seconds} from "./row.js";

const SAME_MOMENT = 60;
const afterIt = (real, placeholder) => seconds(real.created_at) >= seconds(placeholder.created_at) - SAME_MOMENT;

export const answers = (real, placeholder) =>
    real.id > 0 &&
    real.table === placeholder.table &&
    afterIt(real, placeholder) &&
    Object.entries(placeholder.same || {}).every(([key, value]) => JSON.stringify(real[key]) === JSON.stringify(value));

export const withoutAnswered = (held, incoming) => held.filter((row) => row.id !== 0 || !incoming.some((real) => answers(real, row)));
