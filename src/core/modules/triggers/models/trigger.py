import json
from dataclasses import dataclass

from core.base.model.model import Model
from engine.errors.refusal import Refusal
from core.base.timestamp import Timestamp
from core.modules.triggers.models.enums.trigger_action import TriggerAction
from core.modules.triggers.models.enums.trigger_match import TriggerMatch
from core.modules.triggers.models.support.trigger_condition import TriggerCondition
from core.modules.triggers.models.support.trigger_extra_action import TriggerExtraAction

TEXT_LIMIT_CHARACTERS = 600
INSTRUCTION_PREFIX = "instruction: "
ALL_PLACES = ("messages", "commands", "files")


@dataclass(frozen=True, kw_only=True)
class Trigger(Model):
    """A named text that reaches the agent when its words appear or its time comes, and passes its conditions:
    as a nudge, an instruction or a refusal, followed by its extra actions. A paused trigger does nothing, nor
    does one that waits for the user to enable it."""

    model_name = "trigger"
    cli_name = "trigger"
    search_fields = ["name", "description", "text"]

    creator_id: int
    phrases: tuple[str, ...] = ()
    action: TriggerAction = TriggerAction.NUDGE
    text: str
    skill: str | None = None
    next_at: Timestamp | None = None
    interval_minutes: int | None = None
    cron_line: str = ""
    end_at: Timestamp | None = None
    fire_limit: int | None = None
    fired_count: int = 0
    ended_at: Timestamp | None = None
    name: str = ""
    description: str = ""
    watch_places: tuple[str, ...] = ALL_PLACES
    match_mode: TriggerMatch = TriggerMatch.PART
    conditions: str = "[]"
    extra_actions: str = "[]"
    paused_at: Timestamp | None = None
    needs_enabling: bool = False

    def __post_init__(self) -> None:
        if self.action is TriggerAction.SKILL and self.next_at is not None:
            raise Refusal("a skill trigger watches words", "make a phrase trigger instead")
        if self.action is TriggerAction.SKILL and not self.skill:
            raise Refusal("a skill trigger needs a skill", "choose a skill from journal skill list")
        if not 1 <= len(self.text) <= TEXT_LIMIT_CHARACTERS:
            raise Refusal(f"a trigger's text is 1 to {TEXT_LIMIT_CHARACTERS} characters, not {len(self.text)}", "say it shorter")
        if not self.phrases and self.next_at is None:
            raise Refusal("a trigger has a phrase or a time", "give phrases, or schedule it")
        if any(self.match_mode.refuses(phrase) for phrase in self.phrases):
            raise Refusal("a trigger's pattern is at most 200 characters and may not repeat a repeat, such as (a+)+", "write a simpler pattern")
        try:
            self.parsed_conditions()
            self.parsed_extra_actions()
        except (KeyError, TypeError, ValueError) as wrong:
            raise Refusal(f"a trigger's conditions or extra actions cannot be read: {wrong}", """write them as JSON, such as [{"type": "agent", "value": "main"}]""") from wrong

    @property
    def is_scheduled(self) -> bool:
        return self.next_at is not None

    @property
    def agent_line(self) -> str:
        return f"{INSTRUCTION_PREFIX}{self.text}" if self.action is TriggerAction.INSTRUCT else self.text

    def parsed_conditions(self) -> tuple[TriggerCondition, ...]:
        return tuple(TriggerCondition.parsed(raw) for raw in json.loads(self.conditions))

    def parsed_extra_actions(self) -> tuple[TriggerExtraAction, ...]:
        return tuple(TriggerExtraAction.parsed(raw) for raw in json.loads(self.extra_actions))
