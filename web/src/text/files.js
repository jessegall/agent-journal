import {register} from "./index.js";

const EXT =
    "py|js|mjs|cjs|ts|tsx|jsx|vue|md|json|css|scss|html|txt|log|yml|yaml|toml|ini|sh|zsh|bash|svg|png|jpg|jpeg|gif|webp|csv|lock|php|cs|java|go|rs|rb|sql|xml|env|gitignore|prettierrc";
const PATH = new RegExp(`(^|[\\s(\`])((?:\\.{1,2}/)?(?:[\\w.-]+/)*[\\w.-]*\\.(?:${EXT}))(?=[\\s).,;:\`]|$)`, "g");
const ICON =
    '<svg class="ico" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 1.8h5.5L12.5 5v9.2H4V1.8Z"/><path d="M9.5 1.8V5h3"/></svg>';

function isFile(path) {
    return !/^https?:|^\d/.test(path) && !path.startsWith("//") && path.replace(/^\.{1,2}\//, "") !== "";
}

register((text, context) =>
    text.replace(PATH, (whole, before, path) =>
        isFile(path)
            ? `${before}<a class="row-pill file-pill" href="#/${context.env}/file?q=${encodeURIComponent(path)}">${ICON}${path}</a>`
            : whole
    )
);
