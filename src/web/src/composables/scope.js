import {inject, reactive} from "vue";
import {api} from "../api/client.js";
import {holding, rows} from "../sync/rows.js";

const HERE = {env: "", api, rows, holding};
const kept = reactive({});
const merged = (list, fresh) => [...list.filter((row) => !fresh.some((f) => f.n === row.n)), ...fresh];

export const useScope = () => inject("scope", HERE);

export function scopeIn(env) {
    const there = api.in(env);
    const rowsThere = (type) => kept[`${env}:${type}`] || [];
    const keep = (type, got) => (kept[`${env}:${type}`] = merged(rowsThere(type), (got && got.rows) || []));
    const hold = async (type, ns) => ns.length && keep(type, await there.list(type, {only: ns, completed: true}));
    const recent = async (type, last) => keep(type, await there.list(type, {last, completed: true}));
    return {env, api: there, rows: rowsThere, holding: hold, recent};
}
