from typing import NotRequired, TypedDict


class AskLevelValues(TypedDict):
    """One level of a question's stack as its stack's JSON keeps it, minutes typed in as text among them."""

    profile: str
    answer_minutes: NotRequired[int | str | None]
    pass_minutes: NotRequired[int | str | None]
