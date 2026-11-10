from dataclasses import dataclass


@dataclass(frozen=True)
class StateMoveEntry:
    """One move of an added state, in the words the registry stores."""

    name: str
    sources: tuple[str, ...]
    target: str
