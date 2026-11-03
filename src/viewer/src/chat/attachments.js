export const UPLOAD_LIMIT_MB = 1024;
export const UPLOAD_LIMIT = UPLOAD_LIMIT_MB * 1024 * 1024;

export const overLimit = (file) => `"${file.name}" is ${Math.ceil(file.size / (1024 * 1024))} MB, over the ${UPLOAD_LIMIT_MB} MB limit for one file.`;
