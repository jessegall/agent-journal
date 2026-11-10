from typing import Self


class UnhandledOccupantError(Exception):
    """An occupant word the code that decides on it has no case for."""

    @classmethod
    def detected(cls, occupant: object) -> Self:
        return cls(f"no case handles the occupant {occupant!r}")
