from dataclasses import dataclass


@dataclass(frozen=True)
class MemoryCounts:
    """The active memory counts for the choices in the viewer."""

    main_count: int
    agent_count: int
    total: int
