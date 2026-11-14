from dataclasses import dataclass


@dataclass(frozen=True)
class TextField:
    """A button field for words a user types."""

    name: str
    label: str

    def accepts(self, value: str) -> bool:
        return True

    def problems(self, owner: str, targets: frozenset[str]) -> list[str]:
        return []
