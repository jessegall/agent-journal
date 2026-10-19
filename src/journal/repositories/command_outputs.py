import os
from datetime import datetime, timezone
from pathlib import Path

from journal.models.command_output import CommandOutput
from journal.support.not_found import NotFound
from journal.repositories.scoped_repository import ScopedRepository


class CommandOutputs(ScopedRepository[CommandOutput]):
    model = CommandOutput

    def of_chain(self, chain: str) -> CommandOutput:
        found = self.selected_everywhere("chain = ? ORDER BY id", (chain,))
        if not found:
            raise NotFound(self.table, chain)
        return found[-1]

    def in_background(self, session: str) -> list[CommandOutput]:
        return [o for o in self.selected("session = ? AND moved = 1 AND ended = 0 ORDER BY id", (session,)) if self.is_running(Path(o.folder))]

    def in_background_over(self, session: str, seconds: int) -> list[CommandOutput]:
        now = datetime.now(timezone.utc)
        return [o for o in self.in_background(session) if (now - o.created_at).total_seconds() >= seconds]

    @staticmethod
    def is_running(folder: Path) -> bool:
        if not folder.is_dir() or (folder / "done").is_file():
            return False
        if not (folder / "pid").is_file():
            return True
        try:
            os.kill(int((folder / "pid").read_text()), 0)
        except (ProcessLookupError, ValueError):
            return False
        return True

    def beyond(self, kept: int) -> list[CommandOutput]:
        """The rows older than the newest so many, across every environment: the rolling log keeps no more."""
        return self.selected_everywhere("id NOT IN (SELECT id FROM command_outputs ORDER BY id DESC LIMIT ?) ORDER BY id", (kept,))
