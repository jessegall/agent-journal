from dataclasses import dataclass


@dataclass(frozen=True)
class Requirement:
    """A program a plugin needs: the shell check that it is there, and a hint for when it is not."""

    check: str = ""
    hint: str = ""

    @classmethod
    def from_json(cls, data: dict) -> "Requirement":
        return cls(**data)
