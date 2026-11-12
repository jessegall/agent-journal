from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from suites.coding.commands.prune_file_edits.prune_file_edits import PruneFileEdits
from suites.coding.models.file_edit import FileEdit

ROWS_KEPT = 1000


class PruneFileEditsHandler(Handler[PruneFileEdits, None]):
    """Removes the edits of the environment past the newest 1000 with one read of them and one deletion, so a scan
    that records many files prunes once."""

    command = PruneFileEdits

    def __init__(self, repository: Repository, queries: Queries) -> None:
        self.repository, self.queries = repository, queries

    def handle(self, command: PruneFileEdits, context: Context) -> None:
        edits = self.queries.query(FileEdit)
        self.repository.delete_many_stored(edits.rows(edits.newest().select.sliced(ROWS_KEPT, ROWS_KEPT)), context)
