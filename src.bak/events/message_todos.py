"""What message to-dos recognises: a to-do the agent filed for a message of the user's, linked or not."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class TodoNamedInReply(Fact):
    """A reply names a to-do that came from the message it answers."""

    message: int
    todo: int


@dataclass(frozen=True, kw_only=True)
class TodoLeftUnlinked(Fact):
    """A to-do that probably came from a message of the user's, and nothing links the two."""

    message: int
    todo: int
