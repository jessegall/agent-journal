export async function sharedData() {
    const got = await fetch("./data.json", {cache: "no-store"});
    if (!got.ok) throw new Error(String(got.status));
    return got.json();
}

export async function sendComment(about, name, text) {
    const got = await fetch("./comment", {
        method: "POST",
        headers: {"Content-Type": "application/json", "X-Shared-Comment": "1"},
        body: JSON.stringify({about, name, text}),
    });
    const body = await got.json().catch(() => ({}));
    if (!got.ok) throw new Error(body.error || "The comment did not go through");
    return body;
}
