const PICTURE = /\.(png|jpe?g|gif|webp|svg)$/i;
const NUL = 0;

export const isPicture = (name) => PICTURE.test(name);

// a file's bytes are text when they read as UTF-8 and hold no NUL byte, which no text file has
export function isText(bytes) {
    try {
        new TextDecoder("utf-8", {fatal: true}).decode(bytes);
        return !new Uint8Array(bytes).includes(NUL);
    } catch {
        return false;
    }
}

export const textOf = (bytes) => new TextDecoder("utf-8").decode(bytes);

