from dataclasses import dataclass


@dataclass(frozen=True)
class PeerQuestion:
    """A question another session's agent asked this one and that it has not answered yet: the message and who asked."""

    message: int
    sender: str
