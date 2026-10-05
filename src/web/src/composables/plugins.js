import {computed} from "vue";
import {rows} from "../sync/rows.js";

export const installedPlugins = () =>
    computed(() =>
        rows("plugin")
            .filter((p) => !p.completed && !p.deleted)
            .map((p) => ({
                n: p.n,
                name: (p.data.manifest || {}).name || "",
                title: p.title,
                description: p.abstract || "It says nothing about itself.",
                version: p.data.version || "no version",
                source: p.data.source,
                commit: p.data.commit ? p.data.commit.slice(0, 12) : "linked folder",
                enabled: !!p.data.enabled,
                dashboards: (p.data.manifest || {}).dashboards || [],
                settings: Object.entries((p.data.manifest || {}).settings || {}).map(([key, s]) => ({
                    key,
                    title: s.title || key,
                    help: s.help || "",
                    type: s.type || "text",
                    options: s.options || [],
                    group: s.group || "",
                    parent: s.parent || "",
                    when: [s.when || []].flat().map((choice) => Object.entries(choice).map(([other, value]) => [other, String(value)])),
                    detail: !!s.detail,
                    value: String(((p.data.settings || {}).chosen || {})[key] ?? s.default ?? ""),
                })),
            }))
    );
