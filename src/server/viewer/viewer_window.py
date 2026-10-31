from collections.abc import Sequence
from dataclasses import dataclass

from core.base.registry.window_entry import WindowEntry
from core.base.viewer.window_loading import WindowLoading


@dataclass(frozen=True)
class ViewerWindow:
    """A window as GET /api/windows lists it for the viewer: its name and title, its entry file's URL with the
    registry's fingerprint or, for a document, the line the viewer reads, how and where it loads, the agent
    roles it is for, the lines it declares, why it is unavailable, and whether the person may already use it."""

    name: str
    title: str
    entry_url: str
    line: str
    loading: str
    place: str
    roles: Sequence[str]
    reads: Sequence[str]
    runs: Sequence[str]
    unavailable_reason: str
    allowed: bool

    @classmethod
    def listed(cls, window: WindowEntry, fingerprint: str) -> "ViewerWindow":
        document = window.loading == WindowLoading.DOCUMENT
        entry_url = "" if document else f"/modules/{window.module}/{window.entry}?v={fingerprint}"
        return cls(window.name, window.title, entry_url, window.entry if document else "", window.loading, window.place, window.roles,
                   window.reads, window.runs, window.unavailable_reason, window.shipped)
