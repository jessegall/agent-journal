import {inject} from "vue";
import {api} from "../api/client.js";
import {holding, rows} from "../sync/rows.js";
import {store} from "../state/store.js";

const HERE = {env: "", api, rows, holding};
const merged = (list, fresh) => [...list.filter((row) => !fresh.some((f) => f.n === row.n)), ...fresh];

export const useScope = () => inject("scope", HERE);

export function scopeIn(env) {
    const there = api.in(env);
    const rowsThere = (type) => store.elsewhere[`${env}:${type}`] || [];
    const keep = (type, got) => (store.elsewhere[`${env}:${type}`] = merged(rowsThere(type), (got && got.rows) || []));
    const hold = async (type, ns) => ns.length && keep(type, await there.list(type, {only: ns, completed: true}));
    const recent = async (type, last) => keep(type, await there.list(type, {last, completed: true}));
    async function recentAll(types, last) {
        const got = await there.dashboard(types, {last});
        types.forEach((type) => got.rows && got.rows[type] && keep(type, got.rows[type]));
    }
    return {env, api: there, rows: rowsThere, holding: hold, recent, recentAll};
}
