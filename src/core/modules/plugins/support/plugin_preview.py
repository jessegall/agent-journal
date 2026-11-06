from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.plugins.support.plugin_manifest import PluginManifest


@dataclass(frozen=True)
class PluginPreview:
    """What a plugin at a source would do once installed, read from its manifest with nothing run: each thing
    it runs, by type, name and command."""

    manifest: PluginManifest
    source: str
    states: Mapping[tuple[str, str], str]

    def json(self) -> Mapping[str, object]:
        rows = [{**row, "state": self.states.get((row["category"], row["label"]), "")} for row in self.manifest.run_rows()]
        return {"name": self.manifest.name, "title": self.manifest.title, "version": self.manifest.version, "source": self.source, "rows": rows}
