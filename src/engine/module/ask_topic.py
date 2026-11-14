from dataclasses import dataclass


@dataclass(frozen=True)
class AskTopic:
    """A subject a helper may ask its parent about, and what the helper does while the answer comes."""

    key: str
    waiting_work: str
    needs_writing: bool = False
