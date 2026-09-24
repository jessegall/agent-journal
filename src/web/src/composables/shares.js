import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {rows} from "../sync/rows.js";

const NAMED = /^(.*) \((\w+) (\d+)\)$/;
const now = () => Date.now() / 1000;
const live = (share) => !share.completed && !share.deleted && share.data.token && !(share.data.expires && share.data.expires < now());

export const openShares = computed(() => rows("share").filter(live));

export const sharesOf = (ref) => computed(() => openShares.value.filter((share) => share.data.target === ref));

export function itemOf(share) {
    const first = (share.brief || "").split("\n")[0];
    const named = NAMED.exec(first);
    return named ? {title: named[1], ref: `${named[2]}:${named[3]}`} : {title: share.title, ref: share.data.target};
}

export function endsOf(share) {
    if (!share.data.expires) return "never ends";
    return `ends ${new Date(share.data.expires * 1000).toLocaleDateString(undefined, {day: "numeric", month: "short"})}`;
}

export const viewsOf = (share) => `${share.data.views || 0} ${share.data.views === 1 ? "view" : "views"}`;

export const stopShare = (share) => api.act("share", share.n, "stop");

export const tunnelStatus = ref(null);

export async function checkTunnel() {
    tunnelStatus.value = await api.command("share", "tunnel").catch(() => null);
    return tunnelStatus.value;
}
