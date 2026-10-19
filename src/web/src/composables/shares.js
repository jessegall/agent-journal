import {computed} from "vue";
import {api} from "../api/client.js";
import {seconds} from "../domain/row.js";
import {rows} from "../sync/rows.js";
import {store} from "../state/store.js";

const now = () => Date.now() / 1000;
const live = (share) => !share.stopped_at && share.token && !(share.expires_at && seconds(share.expires_at) < now());

export const openShares = computed(() => rows("shares").filter((share) => live(share) && share.approved));

export const waitingShares = computed(() => rows("shares").filter((share) => live(share) && !share.approved));

export const sharesOf = (ref) => computed(() => openShares.value.filter((share) => share.target === ref));

export const waitingOf = (ref) => computed(() => waitingShares.value.filter((share) => share.target === ref));

export const locked = (share) => Boolean(share.locked);

export const KINDS = {docs: "document", reports: "report", plans: "plan"};

// What a link opens, by the first line the journal names it with, "Launch notes (docs:1)".
export function itemOf(share) {
    const first = (share.opens || [])[0] || "";
    return {title: first.replace(/ \([a-z_]+:\d+\)$/, "") || share.target, ref: share.target};
}

export function endsOf(share) {
    if (!share.expires_at) return "never ends";
    return `ends ${new Date(share.expires_at).toLocaleDateString(undefined, {day: "numeric", month: "short"})}`;
}

export const viewsOf = (share) => `${share.views || 0} ${share.views === 1 ? "view" : "views"}`;

export const stopShare = (share) => api.act("shares", share.id, "stop");

export const linksOf = async (ref) => (await api.list("shares", {limit: 200})).rows.filter((share) => live(share) && share.target === ref);

export async function stopLinksOf(ref) {
    const links = await linksOf(ref);
    for (const link of links) await stopShare(link);
    return links.length;
}

export const approveShare = (share) => api.act("shares", share.id, "approve");

export const tunnelStatus = computed(() => store.tunnel);

const UNKNOWN_TUNNEL = {
    installed: true,
    logged_in: true,
    command: "",
    host: "",
    server: "",
    address: "",
    problems: ["The journal could not find out whether sharing works. Check that it is running, then check again."],
};

export async function checkTunnel() {
    store.tunnel = await api.tunnel().catch(() => UNKNOWN_TUNNEL);
    return store.tunnel;
}

export async function recheckTunnel() {
    store.tunnel = await api.tunnelRecheck().catch(() => UNKNOWN_TUNNEL);
    return store.tunnel;
}

export const linkMessage = (title, link) => `Here's the link to ${title}: ${link}`;
