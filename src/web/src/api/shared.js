export async function sharedData() {
    const got = await fetch("./data.json", {cache: "no-store"});
    if (!got.ok) throw new Error(String(got.status));
    return got.json();
}

async function posted(path, given, failed) {
    const got = await fetch(path, {
        method: "POST",
        headers: {"Content-Type": "application/json", "X-Shared-Comment": "1"},
        body: JSON.stringify(given),
    });
    const body = await got.json().catch(() => ({}));
    if (!got.ok) throw new Error(body.error || failed);
    return body;
}

export function sendComment(about, name, text) {
    return posted("./comment", {about, name, text}, "The comment did not go through");
}

export function sendAnswer(comment, name, choice) {
    return posted("./answer", {comment, name, choice}, "The answer did not go through");
}
