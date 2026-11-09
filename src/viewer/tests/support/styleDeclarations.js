import {readFileSync} from "node:fs";
import {resolve} from "node:path";

// the declarations of one selector's rule, read from the style of a component's file under src/viewer
export function styleDeclarations(file, selector) {
    const style = readFileSync(resolve(__dirname, "..", "..", file), "utf8").split("<style")[1].replace(/^[^>]*>/, "");
    const rule = style.split("}").find((block) => block.split("{")[0].trim() === selector);
    return rule ? rule.split("{")[1] : "";
}
