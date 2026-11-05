from dataclasses import dataclass

from core.base.change.domain_event import DomainEvent
from core.base.model.model import END_CHANGE
from core.modules.processes.models.output import Output


@dataclass(frozen=True)
class OutputEnded(DomainEvent[Output]):
    """An output has all its text."""

    change_name = END_CHANGE
