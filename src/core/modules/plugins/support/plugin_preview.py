from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.plugins.support.plugin_manifest import PluginManifest


@dataclass(frozen=True)
class PluginPreview:
    """What a plugin at a source would do once installed, read from its manifest with nothing run: each thing
    it runs, by type, name and command."""

    manifest: PluginManifest
    source: str

    def json(self) -> Mapping[str, object]:
        return {"name": self.manifest.name, "title": self.manifest.title, "version": self.manifest.version, "source": self.source, "rows": list(self.manifest.run_rows())}
