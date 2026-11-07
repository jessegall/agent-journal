from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class PluginLatest:
    """The newest release a plugin's source has against the one installed; a source with no release has no
    newest."""

    name: str
    installed: str
    newest: str | None
    is_newer: bool

    def line(self) -> str:
        if self.newest is None:
            return f"{self.name}: its source has no release"
        return f"{self.name}: {self.newest} is newer than {self.installed}" if self.is_newer else f"{self.name}: {self.installed} is the newest"

    def json(self) -> Mapping[str, object]:
        return {"name": self.name, "installed": self.installed, "newest": self.newest, "is_newer": self.is_newer, "line": self.line()}
