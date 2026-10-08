const KB = 1024;
const MB = KB * KB;

export function sizeWords(bytes) {
    if (bytes < KB) return `${bytes} bytes`;
    return bytes < MB ? `${Math.round(bytes / KB)} KB` : `${(bytes / MB).toFixed(1)} MB`;
}

const count = (n, one, many) => `${n} ${n === 1 ? one : many}`;

export const travelsLine = ({files, bytes, environments}) =>
    `Connecting sends ${count(files, "file", "files")} (${sizeWords(bytes)}) from ${count(environments.length, "environment", "environments")}. Keys, tokens, phones and live state stay on this machine.`;

const STEPS = {
    "in step": "In step with the server.",
    "upgrade here": "This copy has to upgrade before it can sync.",
    "migrate pulled": "This copy is ahead of the server and will bring what it pulls up to date.",
    "pull again": "The server's record started again, so this copy pulls everything afresh.",
};

export const stepWords = (step) => STEPS[step] || "";
