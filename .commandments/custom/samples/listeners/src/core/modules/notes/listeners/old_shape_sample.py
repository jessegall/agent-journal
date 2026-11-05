from core.base.change.change import Change
from core.base.change.created import Created
from core.base.change.logged_event import LoggedEvent
from core.base.listener.commit_listener import CommitListener
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.queries import Queries


class Note(Model):
    """A sample row."""

    model_name = "note"


class GuessingSample(SaveListener):
    """Asks what its row is and reads a Change."""

    name = "notes.guessing"
    event = "note.create"

    def handle(self, change: Change[Model]) -> None:
        if isinstance(change.row, Note):
            return


class LoadingSample(CommitListener[Created[Note]]):
    """Loads the row the runner has loaded."""

    name = "notes.loading"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def handle(self, event: Created[Note], logged: LoggedEvent) -> None:
        self.queries.query(Note).find(logged.row_id)
