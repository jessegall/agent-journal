// Stops the agent running in the environment of this name.
export async function stopAgentNamed(client, name) {
    const got = await client.list("environments");
    const row = (got.rows || []).find((e) => e.name === name);
    if (!row) throw new Error(`There is no environment called ${name}.`);
    return client.stopAgentIn(row.id);
}
