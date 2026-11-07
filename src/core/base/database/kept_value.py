from dataclasses import dataclass


@dataclass(frozen=True)
class KeptValue:
    """What was read from a table, with the table's signature and the database's change mark at that read."""

    signature: tuple[tuple[object, ...], ...]
    change_mark: tuple[int, int]
    value: object
