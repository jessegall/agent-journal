from collections.abc import Mapping
from dataclasses import dataclass

from engine.errors.refusal import Refusal
from core.modules.triggers.models.enums.trigger_extra_action_type import TriggerExtraActionType

WEB_LIMIT_SECONDS = "10"


@dataclass(frozen=True)
class TriggerExtraAction:
    """Something more a trigger does when it fires: the target is a command line, or a web address to call."""

    type: TriggerExtraActionType
    target: str
    folder: str | None = None
    notify_agent: bool = False

    def __post_init__(self) -> None:
        if not self.target.strip():
            raise Refusal(f"a {self.type} action needs a command line or a web address")

    @classmethod
    def parsed(cls, raw: Mapping[str, object]) -> "TriggerExtraAction":
        folder = raw.get("folder")
        return cls(TriggerExtraActionType(str(raw["type"])), str(raw["target"]), str(folder) if folder else None, raw.get("notify_agent") is True)

    def program_arguments(self) -> tuple[str, ...]:
        if self.type is TriggerExtraActionType.WEB:
            return ("curl", "-fsS", "-m", WEB_LIMIT_SECONDS, "--url", self.target)
        return ("sh", "-c", self.target)
