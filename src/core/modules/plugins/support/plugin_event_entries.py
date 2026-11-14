from functools import cached_property

from engine.registry.registry import Registry
from core.modules.plugins.support.plugin_manifest import PluginManifest


class PluginEventEntries:
    """Adds subscriptions for named events from the registry to a plugin manifest."""

    def __init__(self, registry: Registry) -> None:
        self.registry = registry

    @cached_property
    def keys(self) -> dict[str, str]:
        return {entry.key: entry.event for entry in self.registry.event_keys.values() if entry.event in self.registry.declared_plugin_events}

    def apply(self, manifest: PluginManifest) -> PluginManifest:
        return manifest.with_declared_events(self.keys)
