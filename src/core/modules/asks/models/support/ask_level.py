from dataclasses import dataclass

from core.modules.asks.models.support.ask_level_values import AskLevelValues


@dataclass(frozen=True)
class AskLevel:
    """One level of a question's stack: the profile whose helper answers there, and the minutes it has to answer
    and to pass the question on, or None for the settings' defaults."""

    profile: str
    answer_minutes: int | None = None
    pass_minutes: int | None = None

    @staticmethod
    def parsed(level: AskLevelValues) -> "AskLevel":
        return AskLevel(level["profile"], AskLevel.minutes(level.get("answer_minutes")), AskLevel.minutes(level.get("pass_minutes")))

    @staticmethod
    def minutes(value: int | str | None) -> int | None:
        return None if value is None else int(value)
