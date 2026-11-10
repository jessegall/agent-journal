from collections.abc import Mapping, Sequence
from dataclasses import dataclass, field


@dataclass(frozen=True)
class WindowListing:
    """A registered window as listed for the viewer."""

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
    sources: Sequence[Mapping[str, object]] = ()
    links: Mapping[str, str] = field(default_factory=dict[str, str])
    slots: Sequence[str] = ()
