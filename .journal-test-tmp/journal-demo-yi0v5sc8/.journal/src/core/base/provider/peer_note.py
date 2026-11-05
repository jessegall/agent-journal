from dataclasses import dataclass


@dataclass(frozen=True)
class PeerNote:
    """A message another agent session sent to this one, as the program's transcript keeps it; its key tells it from
    every other note of that session."""

    sender: str
    text: str
    key: str
