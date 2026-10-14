"""What message buttons recognises: buttons that name something that cannot run, and a reply in the user's own words to a row that waits on its buttons."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class ButtonsUnrunnable(Fact):
    """A row carries buttons that name something that cannot run; these are the ones that can."""

    type: str
    n: int
    kept: list


@dataclass(frozen=True, kw_only=True)
class AnsweredInOwnWords(Fact):
    """The user answered a row that waits on its buttons by writing a comment on it, in these words."""

    type: str
    n: int
    words: str
