from dataclasses import dataclass


@dataclass(frozen=True)
class VersionRequest:
    """One old version of an item of the shared server: its share, its number and the version asked for."""

    share: str
    item_id: int
    version: int
