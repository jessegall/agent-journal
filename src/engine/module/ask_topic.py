from dataclasses import dataclass

from engine.types.class_fields import class_fields


@dataclass(frozen=True)
class AskTopic:
    """A subject a helper may ask its parent about, and what the helper does while the answer comes."""

    key: str
    waiting_work: str
    requires_writing: bool = False

    # a topic written as a class in its own file sets the fields as class attributes
    @classmethod
    def declared(cls) -> "AskTopic":
        return AskTopic(**class_fields(cls, AskTopic))
