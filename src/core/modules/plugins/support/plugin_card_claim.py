from engine.file.file_access import FileAccess
from dataclasses import dataclass
from pathlib import Path

from core.modules.plugins.support.plugin_card_answer import PluginCardAnswer


@dataclass(frozen=True)
class PluginCardClaim:
    """A queued card kept on disk until its output is saved."""

    path: Path
    answer: PluginCardAnswer
    remaining: str | None

    def remove_cards(self) -> None:
        if self.remaining is not None:
            draft = self.path.with_suffix(".tmp")
            FileAccess.write(draft, self.remaining)
            FileAccess.replace(draft, self.path.with_suffix(".json"))
        FileAccess.unlink(self.path, missing_ok=True)
