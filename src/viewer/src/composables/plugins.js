import {computed, ref, watch} from "vue";
import {api} from "../api/client.js";
import {seconds} from "../domain/row.js";
import {rows} from "../sync/rows.js";
import {pageOf} from "../sync/paging.js";

// Each setting's kind as the settings form draws it.
const TYPES = {choice: "options", flag: "flag", number: "number", list: "list", secret: "secret", text: "text"};

// A setting's value as the form shows it: a secret by its number, never its value.
const shown = (value) => (value && typeof value === "object" && "secret" in value ? `secret ${value.secret}` : String(value ?? ""));

export const pluginFrom = (p) => ({
    id: p.id,
    name: p.name,
    title: p.manifest.title || p.name,
    description: p.manifest.description || "No description.",
    version: p.manifest.version || "no version",
    source: p.source,
    commit: p.commit_sha ? p.commit_sha.slice(0, 12) : "linked folder",
    enabled: p.enabled,
    state: p.status,
    holds: (p.manifest.holds || []).map((h) => (typeof h === "string" ? h : h.window_ms ? `${h.event} within ${h.window_ms} ms` : h.event)),
    lastFault: p.last_fault || "",
    lastFaultAt: seconds(p.last_fault_at),
    waitsFor: p.wait_target || "",
    ignored: p.manifest.ignored || [],
    failingSince: seconds(p.failed_at),
    dashboards: p.manifest.dashboard ? [p.manifest.dashboard] : [],
    settings: (p.schema || []).map((s) => ({
        key: s.key,
        title: s.title || s.key,
        help: s.help || "",
        type: TYPES[s.setting_type] || "text",
        options: s.choices || [],
        group: "",
        parent: "",
        when: [],
        detail: false,
        value: shown(p.settings[s.key] ?? s.default ?? ""),
    })),
});

export function installedPlugins() {
    const whole = ref([]);
    const load = () => api.list("plugins", {limit: pageOf("plugins")}).then((got) => (whole.value = got.rows || []));
    watch(() => rows("plugins").map((p) => `${p.id}:${p.updated_at}`).join(","), load, {immediate: true});
    return computed(() => whole.value.map(pluginFrom));
}
