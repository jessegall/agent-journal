import json
from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from engine.time.timestamp import Timestamp
from core.modules.asks.models.ask_level import AskLevel
from core.modules.asks.models.enums.ask_outcome import AskOutcome


@dataclass(frozen=True, kw_only=True)
class Ask(EnvironmentScoped, Model):
    """A question a helper asked its parent: its topic and text, the stack of levels it goes up, the level it is
    at, and how it ended."""

    model_name = "ask"
    cli_name = "ask"

    environment_id: int = 0
    creator_id: int
    asker_id: int
    parent_id: int
    topic: str
    text: str
    facts_json: str = "{}"
    wait_id: int | None = None
    task_id: int | None = None
    stack_json: str = "[]"
    level_index: int = 0
    outcome: AskOutcome | None = None
    closed_at: Timestamp | None = None
    parent_ask_id: int | None = None
    group_key: str = ""

    @property
    def is_open(self) -> bool:
        return self.closed_at is None

    @property
    def is_at_parent(self) -> bool:
        return self.level_index >= len(self.levels())

    def levels(self) -> tuple[AskLevel, ...]:
        return tuple(AskLevel(str(level["profile"]), int(level["answer_minutes"]), int(level["pass_minutes"])) for level in json.loads(self.stack_json))
