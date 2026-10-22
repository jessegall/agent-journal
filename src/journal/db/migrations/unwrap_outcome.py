from dataclasses import dataclass
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from journal.db.migrations.stored_state import StoredState


@dataclass(frozen=True)
class UnwrapOutcome:
    """A stored state with the layers of one state taken out of its chain, and those layers, the innermost first."""

    state: "StoredState"
    claimed: tuple["StoredState", ...]
