export const TUNNEL_SERVICE = "sharing.tunnel";

export function tunnelState(status, open, waiting, service) {
    if (status && status.problems.length) return {key: "down", word: "Not connected"};
    if (!open.length && !waiting.length) return {key: "idle", word: "Nothing shared"};
    if (!open.length) return {key: "waiting", word: "Needs you"};
    if (!service) return {key: "starting", word: "Starting"};
    if (service.state === "ready") return {key: "up", word: "Open"};
    if (service.state === "starting") return {key: "starting", word: "Starting"};
    return {key: "down", word: service.why || "Not running"};
}
