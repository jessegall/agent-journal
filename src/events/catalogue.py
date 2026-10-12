"""Every event this journal has, by the string it is matched on: the journal's own, and the ones its plugins declare.

A feature names the event it hears by its class, so the catalogue is read by import; this reads the whole of it at
once, for the checks that must answer whether a string names an event at all. A plugin declares its events in its
manifest rather than in code, so each one is seated here as an entry of its own, under the plugin's name.
"""

import importlib
from pathlib import Path

from events.typed import TypedEvent

HERE = Path(__file__).parent


def entries(base: type) -> list[type]:
    found = []
    for kind in base.__subclasses__():
        found.append(kind)
        found.extend(entries(kind))
    return found


class Catalogue:
    """What the journal knows how to be told. Read once, at seating, and added to when a plugin is seated."""

    def __init__(self):
        self.of_the_journal: dict[str, type[TypedEvent]] = {}
        self.of_plugins: dict[str, type[TypedEvent]] = {}

    def read(self) -> dict[str, type[TypedEvent]]:
        """The journal's own entries, read once: every module of the catalogue is imported and every class with an `on` is one."""
        if not self.of_the_journal:
            for path in sorted(HERE.glob("*.py")):
                importlib.import_module(f"events.{path.stem}")
            self.of_the_journal = {kind.on: kind for kind in entries(TypedEvent) if kind.on and kind.on not in self.of_plugins}
        return self.of_the_journal

    def seat(self, plugin: str, declared) -> dict[str, type[TypedEvent]]:
        """The events a plugin declares, as entries of the catalogue named <plugin>.<event>, made once for each."""
        for name in declared:
            on = f"{plugin}.{name}"
            if on not in self.of_plugins:
                self.of_plugins[on] = type(f"{plugin}.{name}", (TypedEvent,), {"on": on, "__doc__": f"The {name} event the {plugin} plugin declares."})
        return self.of_plugins

    def named(self) -> set[str]:
        """Every string that names an event, the plugins' own included."""
        return set(self.read()) | set(self.of_plugins)


CATALOGUE = Catalogue()
