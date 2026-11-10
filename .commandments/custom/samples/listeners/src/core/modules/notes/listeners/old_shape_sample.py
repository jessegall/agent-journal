from engine.change.change import Change
from engine.change.created import Created
from engine.change.logged_event import LoggedEvent
from core.base.listener.commit_listener import CommitListener
from core.base.listener.save_listener import SaveListener
from engine.model.model import Model
from engine.query.queries import Queries


# @sin architecture_core_second_class_in_a_file
# @sin architecture_layout_helper_in_a_kind_folder
# @sin architecture_layout_suite_model_outside_models
class Note(Model):
    """A sample row."""

    model_name = "note"


# @sin naming_class_unnamed_for_its_base
# @sin architecture_core_second_class_in_a_file
class GuessingSample(SaveListener):
    """Asks what its row is and reads a Change."""

    name = "notes.guessing"
    # @sin architecture_listeners_listener_event_named_by_a_string
    event = "note.create"

    def handle(self, change: Change) -> None:
        # @sin architecture_listeners_row_type_guessed_in_a_listener
        if isinstance(change.row, Note):
            return

    def command_check(self, change: Change, context: object) -> None:
        # @righteous architecture_listeners_row_type_guessed_in_a_listener
        if isinstance(context.command, Note):
            return


# @sin architecture_core_second_class_in_a_file
# @sin naming_class_unnamed_for_its_base
class LoadingSample(CommitListener[Created[Note]]):
    """Loads the row the runner has loaded."""

    name = "notes.loading"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def handle(self, event: Created[Note], logged: LoggedEvent) -> None:
        # @sin architecture_listeners_row_loaded_from_an_event
        self.queries.query(Note).find(logged.row_id)
