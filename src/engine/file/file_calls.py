from collections import Counter
from dataclasses import dataclass, field


@dataclass(frozen=True)
class FileCalls:
    """The file system calls of one hook or request: how many of each kind, a check, a read and an entry listed,
    and the code line outside the file door that made them."""

    kinds: Counter[str] = field(default_factory=Counter)
    origins: Counter[str] = field(default_factory=Counter)

    @property
    def total(self) -> int:
        return sum(self.kinds.values())
