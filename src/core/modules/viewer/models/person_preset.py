from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from engine.model.environment_scoped import EnvironmentScoped


@dataclass(frozen=True, kw_only=True)
class PersonPreset(EnvironmentScoped, Model):
    """A layout one person saved as a preset for one viewer page in one environment, offered in their picker
    beside the suite's presets; its shape is the layout tree's JSON."""

    model_name = "person_preset"
    cli_name = "person-preset"

    environment_id: int = 0
    person_id: int
    creator_id: int
    page: str
    name: str
    shape: str
