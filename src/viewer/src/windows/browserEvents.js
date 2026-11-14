import {transport} from "../api/transport.js";
import {checkServer} from "../state/updating.js";
import {matches} from "./windowSubscriptions.js";

const CHANNEL = "journal.events";
const LOCK = "journal.events";

// the event stream of a whole browser: the browser allows six connections to one host, so a stream for each tab would fill them and stop every request
// the tab that holds the lock holds the one stream, for what all the tabs follow, and tells the others each event; when it goes the lock passes to another
// tab, which goes on from the last event; each tab keeps only the events of its environment and patterns; the stream resumes by itself from the last event
// it had, and a break makes every tab ask whether the server went away
export class BrowserEvents {
    constructor() {
        this.id = crypto.randomUUID();
        this.followers = new Set();
        this.wanted = new Map();
        this.channel = null;
        this.leading = false;
        this.source = null;
        this.active = "";
        this.cursor = null;
    }

    follow(follower) {
        this.followers.add(follower);
        this.tellWanted();
        return () => {
            this.followers.delete(follower);
            this.tellWanted();
        };
    }

    // with no way to share, as on an address the browser does not count as secure, the tab holds its own stream
    start() {
        this.leading = !sharing();
        if (this.leading) return this;
        this.channel = new BroadcastChannel(CHANNEL);
        this.channel.onmessage = ({data}) => this.told(data);
        addEventListener("pagehide", () => this.channel.postMessage({type: "gone", tab: this.id}));
        navigator.locks.request(LOCK, () => {
            this.lead();
            return new Promise(() => {});
        });
        return this;
    }

    lead() {
        this.leading = true;
        this.channel.postMessage({type: "asked"});
        this.tellWanted();
    }

    told(message) {
        if (message.type === "event") this.arrived(message.event);
        if (message.type === "cursor") this.cursor = Math.max(this.cursor ?? 0, message.id);
        if (message.type === "broken") checkServer();
        if (message.type === "asked") this.tellWanted();
        if (!this.leading) return;
        if (message.type === "wanted") this.wanted.set(message.tab, message.follows);
        if (message.type === "gone") this.wanted.delete(message.tab);
        if (message.type === "wanted" || message.type === "gone") this.open();
    }

    tellWanted() {
        const follows = [...this.followers].map(({environment, patterns}) => ({environment, patterns}));
        if (!this.leading) return this.channel.postMessage({type: "wanted", tab: this.id, follows});
        this.wanted.set(this.id, follows);
        return this.open();
    }

    requested() {
        const follows = [...this.wanted.values()].flat();
        if (!follows.length) return "";
        const sorted = (values) => [...new Set(values)].sort();
        return JSON.stringify({environments: sorted(follows.map((follow) => follow.environment)), patterns: sorted(follows.flatMap((follow) => follow.patterns))});
    }

    open() {
        const requested = this.requested();
        if (!requested) return this.close();
        if (this.source && (this.active === requested || this.cursor === null)) return undefined;
        this.source?.close();
        const {environments, patterns} = JSON.parse(requested);
        const query = new URLSearchParams();
        for (const environment of environments) query.append("environment", environment);
        for (const pattern of patterns) query.append("follow", pattern);
        if (this.cursor !== null) query.set("cursor", String(this.cursor));
        this.active = requested;
        const opened = transport.stream(`/api/events?${query}`);
        this.source = opened;
        opened.addEventListener("cursor", (message) => {
            if (this.source !== opened) return;
            this.cursor = JSON.parse(message.data).id;
            this.channel?.postMessage({type: "cursor", id: this.cursor});
            this.open();
        });
        opened.onmessage = (message) => {
            if (this.source !== opened) return;
            const event = JSON.parse(message.data);
            this.channel?.postMessage({type: "event", event});
            this.arrived(event);
        };
        opened.onerror = () => {
            this.channel?.postMessage({type: "broken"});
            checkServer();
        };
        return undefined;
    }

    close() {
        this.source?.close();
        this.source = null;
        this.active = "";
        this.cursor = null;
    }

    // a tab that took the stream over hears again what came since the last event any tab knew, so what it had is dropped
    arrived(event) {
        if (event.id <= this.cursor) return;
        this.cursor = event.id;
        for (const {environment, patterns, heard} of this.followers) {
            if ((event.environment ?? environment) === environment && patterns.some((pattern) => matches(pattern, event.event))) heard(event);
        }
    }
}

const sharing = () => typeof BroadcastChannel !== "undefined" && Boolean(navigator.locks);

let shared = null;

// the browser's events for a tab; a tab that cannot share has a stream for each page that asks, ended with that page
export const browserEvents = () => (sharing() ? (shared ??= new BrowserEvents().start()) : new BrowserEvents().start());
