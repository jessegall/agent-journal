from collections.abc import Mapping, Sequence
from dataclasses import dataclass, field


@dataclass(frozen=True)
class WindowListing:
    """A window as GET /api/windows lists it for the viewer: its name, module and title, its entry file's URL
    with its module's fingerprint or, for a document, the line the viewer reads, how and where it is drawn,
    whose work it shows, the agent roles it is for, the lines and events it declares, why it is unavailable,
    whether the journal ships it, and its icon, float size, pane menu options, count line and loading skeleton."""

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
    group: str = ""
    auto_scroll: str = ""
    tabs: Sequence[Mapping[str, str]] = ()
    search: Mapping[str, object] = field(default_factory=dict[str, object])
    shows: str = "environment"
    skeleton: Sequence[Mapping[str, object]] = ()
