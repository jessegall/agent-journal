const PICTURE = /\.(png|jpe?g|gif|webp)$/i;

export const isPicture = (name) => PICTURE.test(name);

export function fileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
}
