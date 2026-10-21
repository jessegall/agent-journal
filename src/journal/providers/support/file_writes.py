from dataclasses import dataclass

from journal.events.agent.peer_message import PeerMessage


@dataclass(frozen=True)
class FileWrites:
    """What a transcript holds past where it was last read: the agent's text blocks, the messages other sessions sent it, and the byte after them."""

    texts: list[str]
    crossed: list[PeerMessage]
    time: int
