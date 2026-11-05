from dataclasses import dataclass


@dataclass(frozen=True)
class StateEntry:
    """One line of the server's list of items: the item's share, number and version, and whether it is removed."""

    share: str
    item_id: int
    version: int
    is_removed: bool
