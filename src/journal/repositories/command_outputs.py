import os
from datetime import datetime, timezone
from pathlib import Path

from journal.models.command_output import CommandOutput
from journal.support.missing_row import MissingRow
from journal.repositories.scoped_repository import ScopedRepository


class CommandOutputs(ScopedRepository[CommandOutput]):
    model = CommandOutput

    def chain_output(self, chain: str) -> CommandOutput:
        rows = self.selected_globally("chain = ? ORDER BY id", (chain,))
        if not rows:
            raise MissingRow(self.table, chain)
        return rows[-1]

    def background(self, session: str) -> list[CommandOutput]:
        return [o for o in self.selected("session = ? AND moved = 1 AND ended = 0 ORDER BY id", (session,)) if self.is_running(Path(o.folder))]

    def backgrounded(self, session: str) -> list[CommandOutput]:
        return self.selected("session = ? AND moved = 1 ORDER BY id", (session,))

    def unannounced(self, session: str) -> list[CommandOutput]:
        return self.selected("session = ? AND moved = 1 AND ended = 1 AND is_announced = 0 ORDER BY id", (session,))

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

    def surplus(self, stored: int) -> list[CommandOutput]:
        return self.selected_globally("id NOT IN (SELECT id FROM command_outputs ORDER BY id DESC LIMIT ?) ORDER BY id", (stored,))
