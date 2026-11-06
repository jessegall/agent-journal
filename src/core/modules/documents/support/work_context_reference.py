from dataclasses import dataclass


@dataclass(frozen=True)
class WorkContextReference:
    """A related resource reference whose body is not expanded into the conversation."""

    model: str
    id: int
    title: str
    relations: tuple[str, ...]
    unavailable: bool = False
