from collections.abc import Mapping
from dataclasses import dataclass

from engine.errors.refusal import Refusal
from core.modules.triggers.models.enums.trigger_condition_type import TriggerConditionType


@dataclass(frozen=True)
class TriggerCondition:
    """One test a trigger must pass before it acts; the value of an hours test is a range such as 9-17."""

    type: TriggerConditionType
    value: str

    def __post_init__(self) -> None:
        if not self.type.accepts(self.value):
            raise Refusal(f"a {self.type} condition cannot test '{self.value}'", "main or helper for agent, a number for fired, a range such as 9-17 for hours")

    @classmethod
    def parsed(cls, raw: Mapping[str, object]) -> "TriggerCondition":
        return cls(TriggerConditionType(str(raw["type"])), str(raw["value"]))
