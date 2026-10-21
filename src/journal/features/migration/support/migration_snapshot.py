from dataclasses import dataclass


@dataclass(frozen=True)
class MigrationSnapshot:
    """The migration feature's reading: whether a version 3 journal waits to be brought across."""

    version_3_waiting: bool
