import json
from dataclasses import dataclass

from engine.errors.refusal import Refusal
from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from engine.time.timestamp import Timestamp
from core.modules.asks.models.ask_level import AskLevel

PARENT_NAMES = ("parent", "main")


@dataclass(frozen=True, kw_only=True)
class AskStack(EnvironmentScoped, Model):
    """The levels a question of one topic goes up, in order, before it reaches the asker's parent."""

    model_name = "ask_stack"
    cli_name = "ask-stack"

    environment_id: int = 0
    creator_id: int
    topic: str
    levels_json: str = "[]"
    needs_approval: bool = False
    ended_at: Timestamp | None = None

    def __post_init__(self) -> None:
        profiles = [level.profile for level in self.levels()]
        repeated = next((profile for profile in profiles if profiles.count(profile) > 1), None)
        if repeated is not None:
            raise Refusal(f"{repeated} is in the stack twice: a question visits each profile once", "name each profile once")
        if any(profile in PARENT_NAMES for profile in profiles):
            raise Refusal("the asker's parent is always the bottom: leave it out", "name only the helper profiles above the parent")
        for level in self.levels():
            self.check_times(level)

    @staticmethod
    def check_times(level: AskLevel) -> None:
        if level.answer_minutes is None or level.pass_minutes is None or level.pass_minutes >= level.answer_minutes:
            return
        raise Refusal(f"at {level.profile} a question passes on after {level.pass_minutes} minutes, before the {level.answer_minutes} minutes it has to answer it",
                      "give it pass minutes of at least its answer minutes")

    def levels(self) -> tuple[AskLevel, ...]:
        return tuple(AskLevel.parsed(level) for level in json.loads(self.levels_json))
