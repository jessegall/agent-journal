from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from core.modules.messages.models.enums.work_source_origin import WorkSourceOrigin


@dataclass(frozen=True, kw_only=True)
class MessageWorkSource(EnvironmentScoped, Model):
    """The current request selected for one agent in one environment."""

    model_name = "message_work_source"
    cli_name = "message-work-source"

    creator_id: int
    agent_id: int
    environment_id: int = 0
    message_id: int | None = None
    origin: WorkSourceOrigin = WorkSourceOrigin.CLEAR
    provisional: bool = False
    used: bool = False
    selection_number: int = 1
