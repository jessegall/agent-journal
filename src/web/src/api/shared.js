export async function sharedData() {
    const got = await fetch("./data.json", {cache: "no-store"});
    if (!got.ok) throw new Error(String(got.status));
    return got.json();
}
