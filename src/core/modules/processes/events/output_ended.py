from dataclasses import dataclass

from core.base.change.domain_event import DomainEvent
from core.modules.processes.models.output import END, Output


@dataclass(frozen=True)
class OutputEnded(DomainEvent[Output]):
    """An output has all its text."""

    change_name = END
