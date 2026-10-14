const KINDS = [
    [/claude\.ai\/design\//, "Design"],
    [/claude\.ai\/(code\/)?artifact\//, "Page"],
    [/github\.com\/.+\/pull\//, "Pull request"],
    [/figma\.com\//, "Figma"],
    [/^https?:\/\/(localhost|127\.0\.0\.1)[:/]/, "Viewer"],
];
const EVENT = /github\.com\/[^/]+\/[^/]+\/(pull|commit)\/|\/commit\/[0-9a-f]{7,}/;

export const linkKind = (href) => (KINDS.find(([pattern]) => pattern.test(href)) || [null, "Link"])[1];

export const standingLink = (notice) => Boolean(notice.data.link) && !notice.data.pull && !EVENT.test(notice.data.link);
