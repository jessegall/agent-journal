import {inject} from "vue";
import {api} from "../api/client.js";
import {isClosed} from "../domain/row.js";
import {PAGE, earlier, hasLoaded, holding, rows} from "../sync/rows.js";
import {store} from "../state/store.js";

const HERE = {env: "", api, rows, loaded: hasLoaded, holding, earlier};
const merged = (list, fresh) => [...list.filter((row) => !fresh.some((f) => f.id === row.id)), ...fresh];

export const useScope = () => inject("scope", HERE);

// The rows of another environment, read and kept apart from this one's, for a panel that shows that environment.
export function scopeIn(env) {
    const there = api.in(env);
    const rowsThere = (table) => store.elsewhere[`${env}:${table}`] || [];
    const loadedThere = (table) => `${env}:${table}` in store.elsewhere;
    const keep = (table, got) => (store.elsewhere[`${env}:${table}`] = merged(rowsThere(table), (got && got.rows) || []));
    const hold = async (table, ids) => ids.length && keep(table, await there.list(table, {ids}));
    const recent = async (table, last) => keep(table, await there.list(table, {limit: last}));
    const recentAll = (tables, last) => Promise.all(tables.map((table) => recent(table, last)));
    const more = {};

    async function earlierThere(...tables) {
        await Promise.all(
            tables
                .filter((table) => more[table] !== false)
                .map(async (table) => {
                    const held = rowsThere(table);
                    const closed = held.filter(isClosed);
                    const before = (closed.length ? closed : held).reduce((low, r) => Math.min(low, r.id), Infinity);
                    const got = await there.list(table, {limit: PAGE, before: Number.isFinite(before) ? before : 0});
                    keep(table, got);
                    more[table] = !got.is_last_page;
                })
        );
    }

    return {env, api: there, rows: rowsThere, loaded: loadedThere, holding: hold, recent, recentAll, earlier: earlierThere};
}
