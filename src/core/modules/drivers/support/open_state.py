from dataclasses import dataclass


@dataclass(frozen=True)
class OpenState:
    """One stacked state of an agent's stack, for a screen: its state type, its state's name, the row its need
    is about, and since when."""

    state: str
    name: str
    rows: tuple[str, ...]
    entered_at: str
