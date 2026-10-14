export function pluginRequest(repository, wish) {
    const where = repository.trim();
    const what = wish.trim();
    return where
        ? `Please make a journal plugin for ${where}. First check that you can reach the repository and tell me whether you can build the integration there, then build it.${what ? ` It should: ${what}` : ""}`
        : `Please make a new journal plugin: ${what}`;
}
