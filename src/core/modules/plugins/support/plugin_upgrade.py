from collections.abc import Mapping, Sequence
from dataclasses import dataclass


@dataclass(frozen=True)
class PluginUpgrade:
    """What an upgrade changes in what a plugin runs, and whether it was applied."""

    name: str
    installed: str
    version: str
    changes: Sequence[str]
    applied: bool
    diff: Sequence[str] = ()

    def json(self) -> Mapping[str, object]:
        return {"name": self.name, "installed": self.installed, "version": self.version, "changes": list(self.changes), "applied": self.applied, "diff": list(self.diff)}
