const CHIP = /\[\[\w+ [^|\]]*\|([^\]]*)\]\]/g;
const MARKS = /\*\*|__|`/g;

export const plain = (text) => String(text || "").replace(CHIP, "$1").replace(MARKS, "");
