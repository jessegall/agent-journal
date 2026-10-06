import {answered} from "./transport.js";

export async function sharedData() {
    const got = await fetch("./data.json", {cache: "no-store"});
    if (!got.ok) throw Object.assign(new Error(String(got.status)), {status: got.status});
    return got.json();
}

async function posted(path, given, failed) {
    const got = await fetch(path, {
        method: "POST",
        headers: {"Content-Type": "application/json", "X-Shared-Comment": "1"},
        body: JSON.stringify(given),
    });
    return answered(got, failed);
}

export const sharedFileUrl = (type, n, name) => `./files/${type}/${n}/${encodeURIComponent(name)}`;

export function sendComment(about, name, text) {
    return posted("./comment", {about, name, text}, "The comment did not go through");
}

export function sendAnswer(comment, name, choice) {
    return posted("./answer", {comment, name, choice}, "The answer did not go through");
}
