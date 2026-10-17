from journal.features.plugins.plugin_settings import PluginSettings
from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import V3Row, seconds
from journal.models.plugin import Plugin
from journal.repositories.plugins import Plugins

TYPES = {"choice": "options", "flag": "flag", "number": "number", "list": "list", "secret": "secret", "text": "text"}
"""Each setting's kind as the settings form draws it."""


class PluginsShaper(Shaper):
    """A plugin as the Plugins page reads it: its manifest, whether it is on, failing or off, what it holds, its last fault, and its settings with their schema; never a secret's value."""

    type = "plugin"

    def __init__(self, plugins: Plugins, settings: PluginSettings) -> None:
        self.plugins, self.settings = plugins, settings

    def rows(self) -> list[V3Row]:
        return [self.row(p) for p in self.plugins.all()]

    def row(self, p: Plugin) -> V3Row:
        manifest = p.manifest
        schema = {s["key"]: {"title": s.get("title", s["key"]), "help": s.get("help", ""), "type": TYPES.get(s["kind"], "text"), "options": s.get("choices", []), "default": s.get("default", "")} for s in self.settings.schema(p)}
        chosen = {key: (f"secret {value['secret']}" if isinstance(value, dict) else value) for key, value in p.settings.items()}
        return V3Row.of("plugin", p, title=manifest.get("title") or p.name, abstract=manifest.get("description", ""), state=self.state_of(p), data={
            "manifest": {"name": p.name, "settings": schema, "dashboards": [manifest["dashboard"]] if manifest.get("dashboard") else []},
            "version": manifest.get("version", ""), "source": p.source, "commit": p.commit_sha, "linked": p.linked, "enabled": p.enabled,
            "hears": list(manifest.get("hears", ())), "holds": list(manifest.get("holds", ())), "services": [s.get("name", "") for s in manifest.get("services", ())],
            "last_fault": p.last_fault, "faults_in_a_row": p.faults_in_a_row, "failing_since": seconds(p.failing_since) if p.failing_since else 0.0,
            "settings": {"chosen": chosen},
        })

    @staticmethod
    def state_of(p: Plugin) -> str:
        return "off" if not p.enabled else "failing" if p.failing_since else "on"
