"""What the acknowledgements feature recognises: a turn that only acknowledged lines the journal delivered."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class NodWithheld(Fact):
    """A turn that only acknowledged journal lines, kept out of the chat and filed as an acknowledgement."""

    agent: int
    turn: str
    text: str


@dataclass(frozen=True, kw_only=True)
class FirstNodWithheld(Fact):
    """The first such turn of an agent, which is told why it went nowhere."""

    agent: int


@dataclass(frozen=True, kw_only=True)
class TurnReachedChat(Fact):
    """A turn that reached the chat, so the same turn is not sent a second time."""

    agent: int
    turn: str
