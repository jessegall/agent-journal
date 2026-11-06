from functools import cached_property

from core.base.registry.registry import Registry
from core.modules.plugins.support.plugin_manifest import PluginManifest


class PluginMoments:
    """Reads the keys of the moments from the registry, which a manifest cannot see, and adds a manifest's listen
    entries on them to what the paths that deliver those moments read."""

    def __init__(self, registry: Registry) -> None:
        self.registry = registry

    @cached_property
    def keys(self) -> dict[str, str]:
        return {entry.key: entry.event for entry in self.registry.event_keys.values() if entry.event in self.registry.plugin_moments}

    def added(self, manifest: PluginManifest) -> PluginManifest:
        return manifest.with_moments(self.keys)
