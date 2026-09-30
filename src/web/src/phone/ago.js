import {age} from "../format/time.js";

export function ago(at) {
    const said = age(at);
    return said === "now" ? "just now" : said && `${said} ago`;
}
