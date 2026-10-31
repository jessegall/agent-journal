from dataclasses import dataclass

from core.base.model.model import Model
from core.base.refusal import Refusal
from core.base.timestamp import Timestamp
from core.modules.triggers.models.enums.trigger_action import TriggerAction

TEXT_LIMIT_CHARACTERS = 600


@dataclass(frozen=True, kw_only=True)
class Trigger(Model):
    """A text that reaches the agent when a phrase is met in the user's words or a tool call, or when its time
    comes: told as a nudge or an instruction, or as a refusal; a scheduled one runs on its time until its end,
    its limit or the day it is struck."""

    model_name = "trigger"
    cli_name = "trigger"

    creator_id: int
    phrases: tuple[str, ...] = ()
    action: TriggerAction = TriggerAction.NUDGE
    text: str
    next_at: Timestamp | None = None
    interval_minutes: int | None = None
    cron_line: str = ""
    end_at: Timestamp | None = None
    fire_limit: int | None = None
    fired_count: int = 0
    ended_at: Timestamp | None = None

    def __post_init__(self) -> None:
        if not 1 <= len(self.text) <= TEXT_LIMIT_CHARACTERS:
            raise Refusal(f"a trigger's text is 1 to {TEXT_LIMIT_CHARACTERS} characters, not {len(self.text)}", "say it shorter")
        if not self.phrases and self.next_at is None:
            raise Refusal("a trigger has a phrase or a time", "give phrases, or schedule it")

    @property
    def is_scheduled(self) -> bool:
        return self.next_at is not None
