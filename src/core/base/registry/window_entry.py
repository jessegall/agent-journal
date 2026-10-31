from collections.abc import Mapping, Sequence
from dataclasses import dataclass


@dataclass(frozen=True)
class WindowEntry:
    """A registered window: its name, the module that declares it, its title, entry file, loading and place,
    the agent roles it is for, the read lines, commands and events it may use, whether the journal ships its
    module, why it is unavailable when its kit does not fit this viewer (empty when it does), and its icon,
    float size, pane menu options, count line and the read lines a share link may use."""

    name: str
    module: str
    title: str
    entry: str
    loading: str
    place: str
    roles: Sequence[str]
    reads: Sequence[str]
    runs: Sequence[str]
    events: Sequence[str]
    shipped: bool
    unavailable_reason: str
    icon: str
    float_width: int
    float_height: int
    options: Sequence[Mapping[str, object]]
    count: str
    shared_reads: Sequence[str] = ()
