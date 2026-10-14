const DEVICES = [
    [/iPhone/, "iPhone"],
    [/iPad/, "iPad"],
    [/Android/, "Android phone"],
    [/Macintosh/, "Mac"],
    [/Windows/, "Windows computer"],
];
const BROWSERS = [
    [/EdgA?\//, "Edge"],
    [/Firefox|FxiOS/, "Firefox"],
    [/Chrome|CriOS/, "Chrome"],
    [/Safari/, "Safari"],
];

const named = (list, agent, fallback) => (list.find(([pattern]) => pattern.test(agent)) || [null, fallback])[1];

export function deviceName(agent = navigator.userAgent) {
    return `${named(DEVICES, agent, "A phone")}, ${named(BROWSERS, agent, "a browser")}`;
}
