from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.processes.commands.mark_watch_seen import MarkWatchSeen
from core.modules.processes.models.watch import Watch


class MarkWatchSeenHandler(Handler[MarkWatchSeen, Watch]):
    """Saves the number of lines a watch has been given."""

    command = MarkWatchSeen

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: MarkWatchSeen, context: Context) -> Watch:
        return self.repository.save(replace(self.queries.query(Watch).find(command.watch_id), seen_lines=command.seen_lines), context)
