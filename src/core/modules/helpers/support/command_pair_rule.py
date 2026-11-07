from collections.abc import Iterator
from dataclasses import dataclass


@dataclass(frozen=True)
class CommandPairRule:
    """Two command settings that work together: both are set or both are empty."""

    first_key: str
    second_key: str

    def problems(self, first: str, second: str) -> Iterator[str]:
        if bool(first.strip()) != bool(second.strip()):
            yield f"{self.first_key} and {self.second_key} are set together or both left empty"
