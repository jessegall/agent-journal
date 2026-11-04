
from core.base.actor_type import ActorType
from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.guard.guards import LIFECYCLE_GUARD
from core.base.model.full_lifecycle import FullLifecycle
from core.base.model.model import Model
from core.base.model.state_book import StateBook
from core.base.model.table import indefinite_article
from core.base.model.unknown_state_error import UnknownStateError
from core.base.refusal import Refusal

METADATA_SUFFIX = ".metadata"


class LifecycleGuard(Guard):
    """A row starts in one of its first states, changes state only by a move its model has, added ones included,
    and is edited or deleted only in a state that allows it."""

    name = LIFECYCLE_GUARD
    event = "*"

    def __init__(self, book: StateBook) -> None:
        self.book = book

    def check(self, change: Change[Model]) -> None:
        lifecycle = self.book.lifecycle(type(change.row))
        if lifecycle is None or change.event.endswith(METADATA_SUFFIX):
            return
        state = change.row.current_state()
        if not lifecycle.has_state(state):
            raise UnknownStateError(f"{state} is no state of {indefinite_article(change.row.cli_name)} {change.row.cli_name}: no installed module registers it")
        if change.old_row is None:
            self.check_start(lifecycle, change.row)
            return
        old_state = change.old_row.current_state()
        if change.new_row is None:
            self.require(old_state in lifecycle.deletable, change.old_row, lifecycle, "so it cannot be deleted")
        elif change.move is not None:
            if change.actor.type is ActorType.AGENT and lifecycle.is_third_party_move(change.move.name):
                raise Refusal(f"the move {change.move.name} comes from a module the journal does not ship, so a person takes it", "press its button in the viewer")
            self.require(lifecycle.has_move(change.move.name) and old_state in lifecycle.move(change.move.name).sources, change.old_row, lifecycle, f"so it cannot {change.move.name}")
        else:
            self.require(old_state in lifecycle.editable, change.old_row, lifecycle, "so it cannot be edited")

    def check_start(self, lifecycle: FullLifecycle, row: Model) -> None:
        if row.current_state() not in lifecycle.initial:
            starts = " or ".join(state.value for state in lifecycle.initial)
            raise Refusal(f"a new {row.cli_name} starts as {starts}, not {row.current_state().value}")

    def require(self, allowed: bool, row: Model, lifecycle: FullLifecycle, reason: str) -> None:
        if allowed:
            return
        state = row.current_state()
        raise Refusal(f"{row.cli_name} {row.id} is {state.value}, {reason}", lifecycle.suggestion(row.cli_name, row.id, state))
