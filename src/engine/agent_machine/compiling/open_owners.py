from abc import ABC, abstractmethod


class OpenOwners(ABC):
    """How many open holds and frames a module owns, so sync can refuse to remove a module that still owns
    some."""

    @abstractmethod
    def open_count(self, module: str) -> int: ...
