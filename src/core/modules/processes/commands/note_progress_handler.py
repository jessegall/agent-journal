from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.processes.commands.note_progress import NoteProgress
from core.modules.processes.models.process import Process


class NoteProgressHandler(Handler[NoteProgress, Process]):
    """Saves the percent on the run."""

    command = NoteProgress

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: NoteProgress, context: Context) -> Process:
        return self.repository.save(replace(self.queries.query(Process).find(command.row_id), progress=min(100, max(0, command.percent))), context)
