from collections.abc import Mapping, Sequence
from dataclasses import field, dataclass, replace

from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_tab import WindowTab
from core.base.viewer.window_source import WindowSource
from core.base.viewer.window_key import WindowKey


@dataclass(frozen=True)
class WindowExtension:
    """Additional commands, events and tabs a module supplies to an existing window."""

    window: str
    reads: Sequence[str] = ()
    runs: Sequence[str] = ()
    events: Sequence[str] = ()
    tabs: Sequence[WindowTab] = ()
    sources: Sequence[WindowSource] = ()
    links: Mapping[str, str] = field(default_factory=dict[str, str])
    keys: Sequence[WindowKey] = ()
    key_events: Mapping[str, Sequence[str]] = field(default_factory=dict[str, Sequence[str]])

    def extend(self, declaration: WindowDeclaration) -> WindowDeclaration:
        keys = tuple(replace(key, events=(*key.events, *self.key_events.get(key.name, ()))) for key in declaration.keys)
        return replace(declaration, reads=(*declaration.reads, *self.reads), runs=(*declaration.runs, *self.runs),
                       events=(*declaration.events, *self.events), tabs=(*declaration.tabs, *self.tabs),
                       sources=(*declaration.sources, *self.sources), links={**declaration.links, **self.links},
                       keys=(*keys, *self.keys))
