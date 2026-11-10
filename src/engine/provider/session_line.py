from dataclasses import dataclass


@dataclass(frozen=True)
class SessionLine:
    """A line for a running agent session, with the session it goes to and the name it comes from."""

    session: str
    sender: str
    text: str
