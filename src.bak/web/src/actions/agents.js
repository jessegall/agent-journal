export async function stopAgentNamed(client, name) {
    const got = await client.list("environment");
    const row = (got.rows || []).find((e) => e.title === name && !e.completed && !e.deleted);
    if (!row) throw new Error(`There is no environment called ${name}.`);
    return client.stopAgentIn(row.n);
}
