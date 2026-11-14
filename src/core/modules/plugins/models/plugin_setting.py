from dataclasses import dataclass

from engine.enums.event_form import EventForm
from engine.model.model import Model


@dataclass(frozen=True, kw_only=True)
class PluginSetting(Model):
    """One setting the user gave a plugin, by the key its manifest declares, its value kept as JSON text."""

    model_name = "plugin_setting"
    event_forms = tuple([EventForm.COMMIT])
    cli_name = "plugin-setting"

    plugin_id: int
    creator_id: int
    key: str
    value: str
    environment_id: int | None = None
