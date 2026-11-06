import {transport} from "./transport.js";

export async function asked(items, cache, navigator, window, globalThis) {
    // @sin architecture_viewer_request_outside_the_funnel
    await fetch("/api/line");
    // @sin architecture_viewer_request_through_the_browser_object
    await window.fetch("/api/line");
    // @sin architecture_viewer_request_through_the_browser_object
    await globalThis.fetch("/api/line");
    // @sin architecture_viewer_request_outside_the_funnel
    const stream = new EventSource("/api/events");
    // @sin architecture_viewer_request_outside_the_funnel
    const socket = new WebSocket("/api/events");
    // @sin architecture_viewer_request_outside_the_funnel
    const request = new XMLHttpRequest();
    // @sin architecture_viewer_request_through_the_browser_object
    navigator.sendBeacon("/api/line");
    // @righteous architecture_viewer_request_outside_the_funnel
    const answer = await transport.raw("/api/line");
    // @righteous architecture_viewer_request_outside_the_funnel
    const kept = await cache.fetch("a row");
    // @righteous architecture_viewer_request_outside_the_funnel
    const opened = transport.stream("/api/events");
    return [stream, socket, request, answer, kept, opened, items];
}
