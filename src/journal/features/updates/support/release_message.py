from dataclasses import dataclass


@dataclass(frozen=True)
class ReleaseMessage:
    """What a release tells the agent once after the journal was updated to it: the version and the words."""

    version: str
    text: str
