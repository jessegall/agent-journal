import {register} from "./index.js";

const CHIP = /\[\[chip ([a-z_]+):(\d+)\|([^\]]*)\]\]/g;

export const words = (text) => String(text || "").replace(CHIP, (whole, type, n, label) => label);

register((text) => text.replace(CHIP, (whole, type, n, label) => `<a class="row-pill" href="#" data-peek="${type}:${n}">${label}</a>`));
