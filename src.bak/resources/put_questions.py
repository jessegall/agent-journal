from dataclasses import dataclass


@dataclass(frozen=True)
class PutQuestion:
    """A question the agent put to its provider's question tool, which the journal asks in its place: the words, the options as the JSON the question command takes, and the agent's pick, none when it named none."""

    text: str
    options: str
    pick: int | None
