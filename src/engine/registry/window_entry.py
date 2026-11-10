from collections.abc import Mapping, Sequence
from dataclasses import dataclass, field

from engine.registry.window_listing import WindowListing
from core.base.viewer.window_loading import WindowLoading


@dataclass(frozen=True)
class WindowEntry:
    """A registered window and its viewer configuration."""

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
    group: str = ""
    auto_scroll: str = ""
    tabs: Sequence[Mapping[str, str]] = ()
    search: Mapping[str, object] = field(default_factory=dict[str, object])
    shows: str = "environment"
    skeleton: Sequence[Mapping[str, object]] = ()
    required_settings: Sequence[str] = ()
    sources: Sequence[Mapping[str, object]] = ()
    links: Mapping[str, str] = field(default_factory=dict[str, str])
    slots: Sequence[str] = ()

    def listing(self, fingerprint: str) -> WindowListing:
        document = self.loading == WindowLoading.DOCUMENT
        entry_url = "" if document else f"/modules/{self.module}/{self.entry}?v={fingerprint}"
        search = {key: value for key, value in self.search.items() if key != "searcher"}
        return WindowListing(self.name, self.module, self.title, entry_url, self.entry if document else "", self.loading, self.place, self.roles,
                             self.reads, self.runs, self.events, self.unavailable_reason, self.shipped, self.icon,
                             self.float_width, self.float_height, self.options, self.count, self.group, self.auto_scroll, self.tabs,
                             search, self.shows, self.skeleton, self.sources, self.links, self.slots)
