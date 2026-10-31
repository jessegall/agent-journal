from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class PluginEvent:
    """One event as a plugin hears it: its version 4 name and the data its line carries."""

    name: str
    data: Mapping[str, object]
