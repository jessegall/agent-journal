"""What chat etiquette recognises in the agent's chat and in the lines the journal delivers to it."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class ShopTalkInChat(Fact):
    """The agent's chat talked about the journal's workings, in these words."""

    agent: int
    words: str


@dataclass(frozen=True, kw_only=True)
class ThirdPersonInChat(Fact):
    """The agent's chat spoke about the user instead of to them, in these words."""

    agent: int
    words: str


@dataclass(frozen=True, kw_only=True)
class EtiquetteDue(Fact):
    """Enough journal lines reached the agent that it is reminded to keep them out of the chat."""

    agent: int


@dataclass(frozen=True, kw_only=True)
class ThickProseInChat(Fact):
    """The agent's chat ran thick with em dashes, the sign of agent prose a person does not type."""

    agent: int
    dashes: int
