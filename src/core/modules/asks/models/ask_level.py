from dataclasses import dataclass


@dataclass(frozen=True)
class AskLevel:
    """One level of a question's stack: the profile whose helper answers there, and the minutes it has to answer
    and to pass the question on, or None for the settings' defaults."""

    profile: str
    answer_minutes: int | None = None
    pass_minutes: int | None = None

    @staticmethod
    def parsed(level: dict[str, object]) -> "AskLevel":
        return AskLevel(str(level["profile"]), AskLevel.minutes(level, "answer_minutes"), AskLevel.minutes(level, "pass_minutes"))

    @staticmethod
    def minutes(level: dict[str, object], field: str) -> int | None:
        value = level.get(field)
        return None if value is None else int(str(value))
