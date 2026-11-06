from dataclasses import dataclass

from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.support.plugin_manifest import PluginManifest


@dataclass(frozen=True)
class RunnablePlugin:
    """An enabled plugin not being upgraded, its manifest and whether its files differ from installation."""

    plugin: Plugin
    manifest: PluginManifest
    is_changed: bool
