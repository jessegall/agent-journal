import re
from dataclasses import dataclass


@dataclass(frozen=True, kw_only=True)
class Event:
    """Something that happened inside the journal, told on the bus to whoever listens."""

    @property
    def key(self) -> str:
        """The event by its name as the catalogue and plugins spell it: Idle as idle, ToolStarting as tool_starting."""
        return re.sub(r"(?<!^)(?=[A-Z])", "_", type(self).__name__).lower()
