import {api} from "../api/client.js";
import {store} from "../state/store.js";
import {checkTunnel} from "./shares.js";

export async function tunnelDomains() {
    const status = await checkTunnel();
    return status && status.logged_in ? api.tunnelDomains().catch(() => []) : [];
}

export async function logOutTunnel() {
    store.tunnel = await api.tunnelLogout();
}

export const logInTunnel = (login) =>
    api.tunnelLogin({
        endpoint: login.endpoint.trim(),
        username: login.username.trim(),
        password: login.password,
        master_password: login.master || undefined,
    });

export const noAccountYet = (login) =>
    `No account "${login.username.trim()}" on ${login.endpoint.trim()} yet. Enter the server's master password to create it.`;

export async function releaseDomain(domain, own) {
    if (!own) return api.tunnelRelease(domain);
    await api.tunnelReaddress();
    return api.tunnelDomains();
}
