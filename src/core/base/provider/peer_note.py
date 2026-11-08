from dataclasses import dataclass


@dataclass(frozen=True)
class PeerNote:
    """A message another agent session sent to this one, as the program's transcript keeps it; its key tells
    it from every other note of that session. The sender is its name when the note has one, else its
    address, which is kept apart so that a message sent to that address can be shown under the name."""

    sender: str
    text: str
    key: str
    address: str = ""
