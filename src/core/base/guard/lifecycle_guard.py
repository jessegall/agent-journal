from enum import StrEnum

from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.guard.guards import LIFECYCLE_GUARD
from core.base.model.lifecycle import Lifecycle
from core.base.model.model import Model
from core.base.refusal import Refusal

METADATA_SUFFIX = ".metadata"


class LifecycleGuard(Guard):
    """A row starts in one of its lifecycle's first states, changes state only by a move its lifecycle lists, and
    is edited or deleted only in a state that allows it."""

    name = LIFECYCLE_GUARD
    event = "*"

    def check(self, change: Change[Model]) -> None:
        lifecycle = type(change.row).lifecycle
        if lifecycle is None or change.event.endswith(METADATA_SUFFIX):
            return
        if change.old_row is None:
            self.check_start(lifecycle, change.row)
            return
        state = change.old_row.current_state()
        if change.new_row is None:
            self.require(state in lifecycle.deletable, change.old_row, lifecycle, "so it cannot be deleted")
        elif change.move is not None:
            self.require(state in change.move.sources, change.old_row, lifecycle, f"so it cannot {change.move.name}")
        else:
            self.require(state in lifecycle.editable, change.old_row, lifecycle, "so it cannot be edited")

    def check_start(self, lifecycle: type[Lifecycle], row: Model) -> None:
        if row.current_state() not in lifecycle.initial:
            starts = " or ".join(state.value for state in lifecycle.initial)
            raise Refusal(f"a new {row.cli_noun} starts as {starts}, not {row.current_state().value}")

    def require(self, allowed: bool, row: Model, lifecycle: type[Lifecycle], consequence: str) -> None:
        if allowed:
            return
        state: StrEnum = row.current_state()
        raise Refusal(f"{row.cli_noun} {row.id} is {state.value}, {consequence}", lifecycle.suggestion(row.cli_noun, row.id, state))
