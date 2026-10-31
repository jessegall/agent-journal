from collections.abc import Sequence
from dataclasses import dataclass
from enum import StrEnum

from core.base.chat.mark_button import MarkButton


@dataclass(frozen=True)
class DockDeclaration:
    """A type of item a module may dock above the chat: its type as a member of the module's own enum, its icon and
    title, the buttons on its wrapper, the file of its body, its limits, and the viewer kit versions it was built for."""

    type: StrEnum
    icon: str
    title: str
    body: str
    buttons: Sequence[MarkButton] = ()
    most: int = 1
    leaves_after_seconds: int = 0
    reads: Sequence[str] = ()
    kit: str = ">=1,<2"
