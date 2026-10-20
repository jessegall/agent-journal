from dataclasses import dataclass

from journal.events.agent.message_crossed import MessageCrossed


@dataclass(frozen=True)
class Written:
    """What a transcript holds past where it was last read: the agent's text blocks, the messages other sessions sent it, and the byte after them."""

    texts: list[str]
    crossed: list[MessageCrossed]
    at: int
