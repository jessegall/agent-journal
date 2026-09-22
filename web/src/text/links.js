import {register} from "./index.js";

const CODE = /`([^`\n]+)`/g;

register((text) => text.replace(CODE, (whole, code) => `<code>${code}</code>`));
