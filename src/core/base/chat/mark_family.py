from dataclasses import dataclass

from core.base.chat.mark_colouring import MarkColouring
from core.base.chat.mark_group import MarkGroup


@dataclass(frozen=True)
class MarkFamily:
    """A family of marks shown under one switch group in Show in chat: its title, its one icon and its group."""

    name: str
    title: str
    icon: str
    group: MarkGroup
    colouring: MarkColouring = MarkColouring.GROUP
