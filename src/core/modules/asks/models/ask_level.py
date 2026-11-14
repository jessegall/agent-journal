from dataclasses import dataclass


@dataclass(frozen=True)
class AskLevel:
    """One level of a question's stack: the profile whose helper answers there, and the minutes it has to answer
    and to pass the question on."""

    profile: str
    answer_minutes: int
    pass_minutes: int
