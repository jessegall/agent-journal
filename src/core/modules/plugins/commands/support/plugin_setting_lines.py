import json
from dataclasses import dataclass

from core.modules.plugins.support.plugin_manifest import PluginManifest


@dataclass(frozen=True)
class PluginSettingLines:
    """A plugin's declared settings with the values the person gave, as plugin settings prints them."""

    manifest: PluginManifest
    values: dict[str, str]

    def lines(self) -> list[str]:
        return [f"{setting.key} {setting.value_type} {self.values[setting.key] if setting.key in self.values else json.dumps(setting.default)}  {setting.title}"
                for setting in self.manifest.settings]
