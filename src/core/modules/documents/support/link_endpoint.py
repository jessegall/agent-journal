from dataclasses import dataclass


@dataclass(frozen=True)
class LinkEndpoint:
    """An endpoint's identity, title, availability and registered navigation reference."""

    model: str
    id: int
    title: str
    exists: bool
    unavailable: bool
    open_ref: str | None
