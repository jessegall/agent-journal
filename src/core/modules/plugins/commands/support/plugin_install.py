from dataclasses import dataclass

from core.modules.plugins.support.plugin_manifest import PluginManifest


@dataclass(frozen=True)
class PluginInstall:
    """What an install did: the plugin's manifest and whether it was installed or only shown."""

    manifest: PluginManifest
    source: str
    installed: bool
