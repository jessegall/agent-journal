const EXTENSIONS = {"image/jpeg": "jpg", "image/svg+xml": "svg", "image/heic": "heic"};
export const UPLOAD_LIMIT_MB = 100;
export const UPLOAD_LIMIT = UPLOAD_LIMIT_MB * 1024 * 1024;
const PASTED = /^image(\.\w+)?$/i;

const extensionOf = (type) => EXTENSIONS[type] || type.split("/")[1] || "png";

function named(file, kept) {
    if (file.name && !PASTED.test(file.name)) return file;
    let n = kept.filter((f) => f.name.startsWith("Pasted image")).length + 1;
    while (kept.some((f) => f.name === `Pasted image ${n}.${extensionOf(file.type)}`)) n += 1;
    return new File([file], `Pasted image ${n}.${extensionOf(file.type)}`, {type: file.type});
}

export function attach(kept, incoming) {
    const added = [];
    const refused = [];
    const oversized = [];
    for (const file of incoming) {
        if (file.size > UPLOAD_LIMIT) {
            oversized.push(file);
            continue;
        }
        const one = named(file, [...kept, ...added]);
        if ([...kept, ...added].some((f) => f.name === one.name)) refused.push(one.name);
        else added.push(one);
    }
    return {added, refused, oversized};
}

export const refusal = (names) => `${names.map((name) => `"${name}"`).join(", ")} ${names.length === 1 ? "is" : "are"} already attached. Rename the file or remove the other one first.`;

export const overLimit = (file) => `"${file.name}" is ${Math.ceil(file.size / (1024 * 1024))} MB, over the ${UPLOAD_LIMIT_MB} MB limit for one file.`;
