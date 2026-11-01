from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from core.modules.plugins.support.plugin_manifest import PluginManifest


@dataclass(frozen=True)
class PluginPreview:
    """What a plugin at a source would do once installed, read from its manifest with nothing run: each thing it runs, by kind, name and command."""

    manifest: PluginManifest
    source: str

    def rows(self) -> Sequence[Mapping[str, str]]:
        manifest = self.manifest
        entries = [*(("requires", requirement.name, requirement.check) for requirement in manifest.requirements),
                   *(("setup", step.name, step.line) for step in manifest.setup_steps),
                   *([("installed", "Asked for its settings", manifest.installed_command)] if manifest.installed_command else []),
                   *([("program", ", ".join(manifest.event_names) or "No events", manifest.program)] if manifest.program else []),
                   *(("service", service.name, " ".join(service.command)) for service in manifest.services),
                   *(("alias", alias.name, alias.line) for alias in manifest.aliases)]
        return [{"kind": kind, "label": label, "command": command} for kind, label, command in entries]

    def json(self) -> Mapping[str, object]:
        return {"name": self.manifest.name, "title": self.manifest.title, "version": self.manifest.version, "source": self.source, "rows": list(self.rows())}
