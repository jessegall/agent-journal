import {computed} from "vue";
import {api} from "../api/client.js";
import {rows} from "../sync/rows.js";
import {store} from "../state/store.js";

const NAMED = /^(.*?) (?:\((\w+) (\d+)\)|\[\[chip (\w+):(\d+)\|[^\]]*\]\])$/;
const now = () => Date.now() / 1000;
const live = (share) => !share.completed && !share.deleted && share.data.token && !(share.data.expires && share.data.expires < now());

export const openShares = computed(() => rows("share").filter((share) => live(share) && share.data.approved));

export const waitingShares = computed(() => rows("share").filter((share) => live(share) && !share.data.approved));

export const sharesOf = (ref) => computed(() => openShares.value.filter((share) => share.data.target === ref));

export const waitingOf = (ref) => computed(() => waitingShares.value.filter((share) => share.data.target === ref));

export const locked = (share) => Boolean(share.data.password);

export const KINDS = {doc: "document", collection: "collection", report: "report", plan: "plan"};

export function itemOf(share) {
    const first = (share.brief || "").split("\n")[0];
    const named = NAMED.exec(first);
    return named ? {title: named[1], ref: share.data.target} : {title: share.title, ref: share.data.target};
}

export function endsOf(share) {
    if (!share.data.expires) return "never ends";
    return `ends ${new Date(share.data.expires * 1000).toLocaleDateString(undefined, {day: "numeric", month: "short"})}`;
}

export const viewsOf = (share) => `${share.data.views || 0} ${share.data.views === 1 ? "view" : "views"}`;

export const stopShare = (share) => api.stopShare(share.n);

export const approveShare = (share) => api.approveShare(share.n);

export const tunnelStatus = computed(() => store.tunnel);

export async function checkTunnel() {
    store.tunnel = await api.tunnelStatus().catch(() => null);
    return store.tunnel;
}

export const linkMessage = (title, link) => `Here's the link to ${title}: ${link}`;
