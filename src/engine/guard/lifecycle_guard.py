
from engine.enums.actor_type import ActorType
from engine.change.changed import Changed
from engine.change.deleted import Deleted
from engine.command.context import Context
from engine.command.errors.completed_command_error import CompletedCommandError
from engine.guard.guard import Guard
from engine.guard.guards import LIFECYCLE_GUARD
from engine.model.full_lifecycle import FullLifecycle
from engine.model.model import Model
from engine.model.state_book import StateBook
from engine.model.table import indefinite_article
from engine.model.errors.unknown_state_error import UnknownStateError
from engine.errors.refusal import Refusal
from engine.errors.user_approval_refusal import UserApprovalRefusal



class LifecycleGuard(Guard[Changed[Model]]):
    """A row starts in one of its first states, changes state only by a move its model has, added ones included,
    and is edited or deleted only in a state that allows it."""

    name = LIFECYCLE_GUARD

    def __init__(self, book: StateBook) -> None:
        self.book = book

    def check(self, event: Changed[Model], context: Context) -> None:
        lifecycle = self.book.lifecycle(type(event.row))
        if lifecycle is None:
            return
        state = event.row.current_state()
        if not lifecycle.has_state(state):
            raise UnknownStateError(f"{state} is no state of {indefinite_article(event.row.cli_name)} {event.row.cli_name}: no installed module registers it")
        if event.old_row is None:
            self.check_start(lifecycle, event.row)
            return
        old_state = event.old_row.current_state()
        if isinstance(event, Deleted):
            self.require(old_state in lifecycle.deletable, event.old_row, lifecycle, "so it cannot be deleted")
        elif event.move is not None:
            if context.actor.type is ActorType.AGENT and lifecycle.is_third_party_move(event.move.name):
                raise UserApprovalRefusal(f"Allow {event.row.cli_name} {event.row.id} to {event.move.name} using an installed module?", command=context.command)
            repeat_allowed = lifecycle.has_move(event.move.name) and old_state in lifecycle.move(event.move.name).sources
            if old_state == event.move.target and old_state not in lifecycle.initial and not repeat_allowed:
                raise CompletedCommandError(f"{event.old_row.cli_name} {event.old_row.id} is {old_state.value}, so it cannot {event.move.name}", lifecycle.suggestion(event.old_row.cli_name, event.old_row.id, old_state))
            self.require(lifecycle.has_move(event.move.name) and old_state in lifecycle.move(event.move.name).sources, event.old_row, lifecycle, f"so it cannot {event.move.name}")
        else:
            self.require(old_state in lifecycle.editable, event.old_row, lifecycle, "so it cannot be edited")

    def check_start(self, lifecycle: FullLifecycle, row: Model) -> None:
        if row.current_state() not in lifecycle.initial:
            starts = " or ".join(state.value for state in lifecycle.initial)
            raise Refusal(f"a new {row.cli_name} starts as {starts}, not {row.current_state().value}")

    def require(self, allowed: bool, row: Model, lifecycle: FullLifecycle, reason: str) -> None:
        if allowed:
            return
        state = row.current_state()
        refusal = Refusal if lifecycle.outgoing_moves(state) else CompletedCommandError
        raise refusal(f"{row.cli_name} {row.id} is {state.value}, {reason}", lifecycle.suggestion(row.cli_name, row.id, state))
