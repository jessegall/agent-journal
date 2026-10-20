from dataclasses import dataclass


@dataclass(frozen=True)
class ProfilesStanding:
    """The profiles feature's reading: every profile of the project by name, those a subagent may be dispatched as, and the workers'."""

    names: tuple[str, ...]
    subagents: tuple[str, ...]
    workers: tuple[str, ...]
