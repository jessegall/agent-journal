from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from core.base.registry.window_entry import WindowEntry
from core.base.viewer.window_loading import WindowLoading


@dataclass(frozen=True)
class ViewerWindow:
    """A window as GET /api/windows lists it for the viewer: its name, module and title, its entry file's URL
    with its module's fingerprint or, for a document, the line the viewer reads, how and where it loads, the
    agent roles it is for, the lines and events it declares, why it is unavailable, whether the journal
    ships it, and its icon, float size, pane menu options and count line."""

    name: str
    module: str
    title: str
    entry_url: str
    line: str
    loading: str
    place: str
    roles: Sequence[str]
    reads: Sequence[str]
    runs: Sequence[str]
    events: Sequence[str]
    unavailable_reason: str
    allowed: bool
    icon: str
    float_width: int
    float_height: int
    options: Sequence[Mapping[str, object]]
    count: str

    @classmethod
    def listed(cls, window: WindowEntry, fingerprint: str) -> "ViewerWindow":
        document = window.loading == WindowLoading.DOCUMENT
        entry_url = "" if document else f"/modules/{window.module}/{window.entry}?v={fingerprint}"
        return cls(window.name, window.module, window.title, entry_url, window.entry if document else "", window.loading, window.place, window.roles,
                   window.reads, window.runs, window.events, window.unavailable_reason, window.shipped, window.icon,
                   window.float_width, window.float_height, window.options, window.count)
