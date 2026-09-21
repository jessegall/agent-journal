<script setup>
defineProps({name: {type: String, default: "dot"}});

const alias = {
    mail: "inbox",
    circle: "todos",
    play: "work",
    flag: "plan",
    file: "docs",
    report: "reports",
    pin: "pins",
    list: "rules",
    clock: "reminders",
    help: "questions",
    bubble: "inbox",
    wrench: "tools",
    brush: "style",
    band: "rules",
    smile: "smile",
    bot: "agents",
    panel: "activity",
    x: "close",
    check: "todos",
    clip: "paperclip",
    send: "arrow",
    more: "dots",
    chevron: "arrow",
};
const shapes = {
    terminal: '<path d="M2 3.5h12v9H2zM4.8 6.4 6.9 8l-2.1 1.6M8.4 10h3"/>',
    gauge: '<path d="M2.6 11.5a5.4 5.4 0 1 1 10.8 0"/><path d="M8 11.5 10.4 7.4"/><circle cx="8" cy="11.5" r=".6" fill="currentColor"/>',
    bolt: '<path d="M9.2 2 4.2 8.8h3.6L6.8 14l5-6.8H8.2z"/>',
    todos: '<circle cx="8" cy="8" r="5.75"/><path d="M5.6 8.1l1.7 1.7 3.2-3.5"/>',
    pins: '<path d="M8 14V9.5M5 2.5h6M6 2.5v3.5L4 9.5h8L10 6V2.5"/>',
    style: '<path d="M5.5 4.5 2.5 8l3 3.5M10.5 4.5l3 3.5-3 3.5M9 3.5l-2 9"/>',
    warn: '<path d="M8 2.6 14 13H2zM8 6.6v3.2M8 11.6v.1"/>',
    book: '<path d="M4 2.5h8.5v11H4a1.5 1.5 0 0 1 0-3h8.5M4 2.5a1.5 1.5 0 0 0 0 3h8.5"/>',
    auto: '<path d="M5 3.4 12.4 8 5 12.6z" fill="currentColor" stroke-width="1"/>',
    branch: '<circle cx="5" cy="3.6" r="1.6"/><circle cx="5" cy="12.4" r="1.6"/><circle cx="11.6" cy="5.4" r="1.6"/><path d="M5 5.2v5.6M11.6 7v.6a3.6 3.6 0 0 1-3.6 3.6H6.6"/>',
    wide: '<path d="M6.2 2.6H2.6v3.6M9.8 2.6h3.6v3.6M6.2 13.4H2.6V9.8M9.8 13.4h3.6V9.8"/>',
    narrow: '<path d="M2.6 6.2h3.6V2.6M13.4 6.2H9.8V2.6M2.6 9.8h3.6v3.6M13.4 9.8H9.8v3.6"/>',
    up: '<path d="M8 12.5V4M4.5 7.5L8 4l3.5 3.5"/>',
    down: '<path d="M8 3.5V12M4.5 8.5L8 12l3.5-3.5"/>',
    download: '<path d="M8 2.5v7.5M5 7l3 3 3-3"/><path d="M3 11v2h10v-2"/>',
    open: '<path d="M9 3.5h3.5V7"/><path d="M12.5 3.5L7.5 8.5"/><path d="M11 9.5v3H3.5V5h3"/>',
    sidepanel: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M9.5 3v10"/>',
    info: '<circle cx="8" cy="8" r="5.75"/><path d="M8 7.3v3.4"/><path d="M8 5.1v.1"/>',
    bell: '<path d="M4.5 11V7.5a3.5 3.5 0 0 1 7 0V11l1 1.5h-9z"/><path d="M6.8 13.5a1.3 1.3 0 0 0 2.4 0"/>',
    activity: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M9.5 3v10M11 6h1M11 8.5h1"/>',
    arrow: '<path d="M3.5 8h9M9 4.5L12.5 8 9 11.5"/>',
    paperclip: '<path d="M10.5 5.5l-4.3 4.3a1.3 1.3 0 0 0 1.8 1.8l4.6-4.6a2.6 2.6 0 0 0-3.7-3.7L4.3 8a3.9 3.9 0 0 0 5.5 5.5l3.7-3.7"/>',
    crosshair: '<circle cx="8" cy="8" r="4.2"/><path d="M8 1.5v3M8 11.5v3M1.5 8h3M11.5 8h3"/>',
    camera: '<path d="M2 5.5h2.6l1.2-1.8h4.4l1.2 1.8H14v7.5H2z"/><circle cx="8" cy="9" r="2.3"/>',
    wheel: '<circle cx="8" cy="8" r="5.6"/><circle cx="8" cy="8" r="1.6"/><path d="M8 2.4v4M8 9.6v4M2.4 8h4M9.6 8h4"/>',
    model: '<path d="M8 2.2c.5 2.9 2 4.4 4.9 4.9-2.9.5-4.4 2-4.9 4.9-.5-2.9-2-4.4-4.9-4.9 2.9-.5 4.4-2 4.9-4.9z"/><path d="M12.6 10.6c.2 1.1.8 1.7 1.9 1.9-1.1.2-1.7.8-1.9 1.9-.2-1.1-.8-1.7-1.9-1.9 1.1-.2 1.7-.8 1.9-1.9z"/>',
    agents: '<circle cx="6" cy="5.5" r="2"/><path d="M2.5 13a3.5 3.5 0 0 1 7 0"/><path d="M10.5 3.8a2 2 0 0 1 0 3.4"/><path d="M11.5 9.8a3.5 3.5 0 0 1 2 3.2"/>',
    reports: '<path d="M4 2.5h5.5L12 5v8.5H4z"/><path d="M6.5 8h3M6.5 10.5h3"/>',
    work: '<circle cx="8" cy="8" r="5.5"/><path d="M8 5v3l2 1.5"/>',
    reminders: '<path d="M13 8a5 5 0 1 1-1.5-3.55"/><path d="M13 2.75V5h-2.25"/><path d="M8 5.5V8l1.75 1.25"/>',
    pencil: '<path d="M10.6 2.8l2.6 2.6-7.4 7.4-3.3.7.7-3.3z"/><path d="M9.2 4.2l2.6 2.6"/>',
    revisions: '<path d="M5.2 4.4h7v9.8h-7z"/><path d="M3.4 11.8V2.2h6.4"/><path d="M7 7.4h3.4M7 10h3.4"/>',
    docs: '<path d="M4 1.8h5.5L12.5 5v9.2H4V1.8Z"/><path d="M9.5 1.8V5h3"/>',
    rules: '<path d="M3 3.5h10M3 8h10M3 12.5h6"/>',
    folder: '<path d="M2.5 3h4l1.5 1.5h5.5v8.5h-11V3Z"/>',
    inbox: '<path d="M2 9.5l1.8-6h8.4l1.8 6v3.5H2V9.5Z"/><path d="M2 9.5h3.5l1 1.5h3l1-1.5H14"/>',
    questions:
        '<circle cx="8" cy="8" r="5.5"/><path d="M6.4 6.3a1.7 1.7 0 0 1 3.2.7c0 1.2-1.6 1.4-1.6 2.5"/><circle cx="8" cy="11.4" r=".6" fill="currentColor" stroke="none"/>',
    home: '<path d="M2.5 7.5L8 2.75l5.5 4.75v6.25h-3.75v-4h-3.5v4H2.5V7.5Z"/>',
    close: '<path d="M4 4l8 8M12 4l-8 8"/>',
    plus: '<path d="M8 3.5v9M3.5 8h9"/>',
    plug: '<path d="M5.2 2.2v3.2M8.8 2.2v3.2M3.4 5.4h7.2v2.1a3.6 3.6 0 0 1-3.6 3.6 3.6 3.6 0 0 1-3.6-3.6Z"/><path d="M7 11.3v2.5"/>',
    tools: '<path d="M9.8 2.3a3 3 0 0 0-3.6 3.9L2.5 9.9a1.2 1.2 0 0 0 1.7 1.7l3.7-3.7a3 3 0 0 0 3.9-3.6L10 6 8.6 5.4 8 4l1.8-1.7Z"/>',
    plan: '<path d="M4 14V2.5M4 3h7.5l-1.5 2.75 1.5 2.75H4"/>',
    search: '<circle cx="7" cy="7" r="4.25"/><path d="M10.25 10.25L13.5 13.5"/>',
    settings:
        '<circle cx="8" cy="8" r="2"/><path d="M8 1.75v1.5M8 12.75v1.5M1.75 8h1.5M12.75 8h1.5M3.6 3.6l1.05 1.05M11.35 11.35l1.05 1.05M3.6 12.4l1.05-1.05M11.35 4.65l1.05-1.05"/>',
    smile: '<circle cx="8" cy="8" r="5.5"/><path d="M5.8 9.5c1.2 1.2 3.2 1.2 4.4 0M6.2 6.5h.01M9.8 6.5h.01"/>',
    dots: '<path d="M4 8h.01M8 8h.01M12 8h.01"/>',
    dot: '<circle cx="8" cy="8" r="2.5"/>',
};
</script>

<template>
    <svg
        class="ico"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        stroke-width="1.4"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        v-html="shapes[alias[name] || name] || shapes.dot"
    />
</template>
