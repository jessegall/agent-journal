// The pages the installed plugins bring, each a dashboard the sidebar opens in a panel: one an enabled plugin with a
// dashboard in its manifest.
export const pluginPages = (plugins) =>
    plugins
        .filter((p) => p.enabled && p.manifest && p.manifest.dashboard)
        .map((p) => ({
            key: `${p.name}.${p.manifest.dashboard.name}`,
            plugin: p.name,
            open: p.manifest.dashboard.name,
            title: p.manifest.dashboard.title || p.manifest.title || p.name,
            icon: p.manifest.dashboard.icon || "plug",
            state: p.status || "",
        }));
