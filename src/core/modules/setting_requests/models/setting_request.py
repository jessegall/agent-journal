from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model


@dataclass(frozen=True, kw_only=True)
class SettingRequest(EnvironmentScoped, Model):
    """A main agent's request to change a setting only a user may change, waiting on the question it asked."""

    model_name = "setting_request"
    cli_name = "setting-request"

    environment_id: int = 0
    creator_id: int
    question_id: int
    key: str
    value: str
    project: bool = False
