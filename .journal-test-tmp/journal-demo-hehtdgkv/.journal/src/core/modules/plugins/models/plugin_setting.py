from dataclasses import dataclass

from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class PluginSetting(Model):
    """One setting the person gave a plugin, by the key its manifest declares, its value kept as JSON text."""

    model_name = "plugin_setting"
    cli_name = "plugin-setting"

    plugin_id: int
    creator_id: int
    key: str
    value: str
