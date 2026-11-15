from dataclasses import dataclass

from engine.enums.line_carrier import LineCarrier
from engine.enums.line_category import LineCategory


@dataclass(frozen=True)
class Line:
    """Keyed text the agent reads, with what it is for, the key of its interval and how it reaches the agent;
    it changes nothing."""

    key: str
    text: str
    category: LineCategory
    interval_key: str
    carrier: LineCarrier
    # the old rule the source that gave it answers for, whose history records when it last spoke
    source_key: str = ""
