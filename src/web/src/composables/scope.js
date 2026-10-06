import {inject} from "vue";
import {api} from "../api/client.js";
import {PAGE, earlier, holding, rows} from "../sync/rows.js";
import {store} from "../state/store.js";

const HERE = {env: "", api, rows, holding, earlier};
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
    const more = {};

    async function earlierThere(...types) {
        await Promise.all(
            types
                .filter((type) => more[type] !== false)
                .map(async (type) => {
                    const held = rowsThere(type);
                    const closed = held.filter((r) => r.completed);
                    const before = (closed.length ? closed : held).reduce((low, r) => Math.min(low, r.n), Infinity);
                    const got = await there.list(type, {last: PAGE, completed: true, before: Number.isFinite(before) ? before : 0});
                    keep(type, got);
                    more[type] = got.more;
                })
        );
    }

    return {env, api: there, rows: rowsThere, holding: hold, recent, recentAll, earlier: earlierThere};
}
