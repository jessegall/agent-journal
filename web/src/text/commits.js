import {register} from "./index.js";

const SHA = /(^|[\s(`])([0-9a-f]{7,40})(?=[\s).,;:`]|$)/g;

register((text, context) =>
    text.replace(SHA, (whole, before, sha) =>
        /\d/.test(sha) && /[a-f]/.test(sha)
            ? `${before}<a class="row-pill" href="#/${context.env}/commit/${sha}">${sha.slice(0, 7)}</a>`
            : whole
    )
);
