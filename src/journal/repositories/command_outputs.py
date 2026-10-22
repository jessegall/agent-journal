import os
from datetime import datetime, timezone
from pathlib import Path
from journal.support.actor import Actor

from journal.models.command_output import CommandOutput
from journal.support.missing_row import MissingRow
from journal.repositories.scoped_repository import ScopedRepository


class CommandOutputs(ScopedRepository[CommandOutput]):
    model = CommandOutput

    def chain_output(self, chain: str) -> CommandOutput:
        rows = self.selected_globally(self.query().filter(chain=chain).order("id"))
        if not rows:
            raise MissingRow(self.table, chain)
        return rows[-1]

    def background(self, session: str) -> list[CommandOutput]:
        return [o for o in self.selected(self.query().filter(session=session, moved=True, ended=False).order("id")) if self.is_running(Path(o.folder))]

    def unfinished(self, creator: Actor) -> list[CommandOutput]:
        return self.selected(self.query().filter(creator=creator, moved=True, ended=False).order("id"))

    def backgrounded(self, session: str | None) -> list[CommandOutput]:
        return self.selected(self.query().filter(session=session, moved=True).order("id"))

    def moved_unended(self) -> list[CommandOutput]:
        return self.selected_globally(self.query().filter(moved=True, ended=False).order("id"))

    def watch(self, output: CommandOutput, reader: str, title: str, actor: Actor) -> CommandOutput:
        for watched in self.watched(output.session):
            self.save(watched.unwatched(), actor)
        return self.save(output.watched(reader, title), actor)

    def all_watched(self) -> list[CommandOutput]:
        return self.selected_globally(self.query().filter(is_watched=True).order("id"))

    def watched(self, session: str | None) -> list[CommandOutput]:
        return self.selected(self.query().filter(session=session, is_watched=True).order("id"))

    def unread(self, session: str) -> list[CommandOutput]:
        return self.selected(self.query().filter(session=session, moved=True, ended=True, is_announced=True, is_read=False, watch_reader="").order("id"))

    def unannounced(self, session: str) -> list[CommandOutput]:
        return self.selected(self.query().filter(session=session, moved=True, ended=True, is_announced=False).order("id"))

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
        return list(reversed(self.selected_globally(self.query().order_descending("id").offset(stored))))
