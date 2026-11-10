from collections.abc import Sequence
from dataclasses import dataclass
from enum import StrEnum

from engine.chat.mark_button import MarkButton


@dataclass(frozen=True)
class DockDeclaration:
    """A module's docked card, with its title, body, fold word, facts and actions. A card whose declaration names a
    word shows that word and its row number at its foot; a card with no word shows no row line."""

    type: StrEnum
    icon: str
    title: str
    body: str = ""
    buttons: Sequence[MarkButton] = ()
    most: int = 1
    leaves_after_seconds: int = 0
    reads: Sequence[str] = ()
    kit: str = ">=1,<2"
    badge: str = ""
    folds: str = ""
    needs_user: bool = False
    word: str = ""
    draws_head: bool = False
    reads_target: bool = True
