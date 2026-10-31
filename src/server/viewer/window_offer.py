from collections.abc import Sequence
from dataclasses import dataclass


@dataclass(frozen=True)
class WindowOffer:
    """A window GET /api/windows offers the viewer: its name and title, the URL of its entry with the registry's
    fingerprint, how and where it loads, the agent roles it is for, why it is unavailable when it is, and whether
    the person may already use it."""

    name: str
    title: str
    entry_url: str
    loading: str
    place: str
    roles: Sequence[str]
    unavailable_reason: str
    allowed: bool
