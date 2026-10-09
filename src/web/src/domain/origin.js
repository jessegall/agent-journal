import {rows} from "../sync/rows.js";

export function originOf(row) {
    if (row.data?.origin) return row.data.origin;
    if (!row.env) return "";
    const ticket = rows("ticket").find((t) => t.data?.work_environment === row.env);
    return ticket ? `Ticket ${ticket.n} · ${ticket.title}` : row.env;
}
