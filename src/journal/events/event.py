import re
from dataclasses import dataclass, field

from journal.events.propagation import Propagation


@dataclass(frozen=True, kw_only=True)
class Event:
    """Something that happened inside the journal, told on the bus to whoever listens. A listener that stops its propagation is the last to hear it."""

    propagation: Propagation = field(default_factory=Propagation, compare=False, repr=False)

    @property
    def key(self) -> str:
        return re.sub(r"(?<!^)(?=[A-Z])", "_", type(self).__name__).lower()

    def stop_propagation(self) -> None:
        self.propagation.stop()
