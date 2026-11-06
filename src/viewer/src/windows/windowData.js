import {READ, transport} from "../api/transport.js";

const WINDOW_ROUTE = "/api/window";

// one read of a window's data: its name and the keys it wants in the headers, its state in the query, through the one funnel
export function windowData(window, environment, only, state, signal) {
    const query = new URLSearchParams({environment, ...state});
    const url = `${WINDOW_ROUTE}?${query}`;
    const headers = {"x-journal-window": window, ...(only.length ? {"x-journal-data-only": only.join(",")} : {})};
    const read = (stop) => transport.whenFree(async () => {
        const response = await transport.sent(url, {signal: stop, headers}, [{window, line: url, kind: READ}]);
        if (!response.ok) throw new Error((await response.json()).error);
        return response.json();
    });
    return transport.joined(`${window} ${only.join(",")} ${query}`, read, signal);
}
