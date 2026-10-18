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
        schema = {s.key: {"title": s.title, "help": s.help, "type": TYPES.get(s.kind, "text"), "options": list(s.choices), "default": "" if s.default is None else s.default} for s in self.settings.schema(p)}
        chosen = {key: (f"secret {value['secret']}" if isinstance(value, dict) else value) for key, value in p.settings.items()}
        return V3Row.of("plugin", p, title=manifest.title or p.name, abstract=manifest.description, state=self.state_of(p), data={
            "manifest": {"name": p.name, "settings": schema, "dashboards": [manifest.dashboard] if manifest.dashboard else []},
            "version": manifest.version, "source": p.source, "commit": p.commit_sha, "linked": p.linked, "enabled": p.enabled,
            "hears": list(manifest.hears), "holds": list(manifest.holds), "services": [s.name for s in manifest.services],
            "last_fault": p.last_fault, "faults_in_a_row": p.faults_in_a_row, "failing_since": seconds(p.failing_since) if p.failing_since else 0.0,
            "settings": {"chosen": chosen},
        })

    @staticmethod
    def state_of(p: Plugin) -> str:
        if not p.enabled:
            return "off"
        return "failing" if p.failing_since else "on"
