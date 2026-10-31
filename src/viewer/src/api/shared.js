import {answered, transport} from "./transport.js";

export async function sharedData() {
    const got = await transport.raw("./data.json", {cache: "no-store"});
    if (!got.ok) throw Object.assign(new Error(String(got.status)), {status: got.status});
    return got.json();
}

// A visitor's comment under a row the link opens, named as docs:12.
export async function sendComment(on, name, text) {
    const got = await transport.raw("./comment", {
        method: "POST",
        headers: {"Content-Type": "application/json", "X-Shared-Comment": "1"},
        body: JSON.stringify({on, name, text}),
    });
    return answered(got, "The comment did not go through");
}
