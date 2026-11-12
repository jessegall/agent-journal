from engine.model.lifecycle import Lifecycle
from engine.model.move import Move
from suites.coding.modules.workers.models.enums.behind_check_state import BehindCheckState as State


class BehindCheckLifecycle(Lifecycle):
    """A look at a worktree behind its base: open until the merger orders an update, leaves it alone or passes
    it to the main agent; an order ends updated or clashing, and a clash is settled into an update. The main
    agent decides after a pass. A check left alone stays closed, and a later look opens a new one; updated and
    gone are final."""

    states = State
    initial = [State.OPEN]
    editable = ()
    deletable = ()

    order = Move("order", [State.OPEN, State.PASSED], State.ORDERED)
    leave = Move("leave", [State.OPEN, State.PASSED], State.LEFT)
    pass_on = Move("pass_on", [State.OPEN, State.ORDERED, State.CONFLICTED], State.PASSED)
    bring_up_to_date = Move("bring_up_to_date", [State.OPEN, State.ORDERED, State.CONFLICTED], State.UPDATED)
    conflict = Move("conflict", [State.ORDERED], State.CONFLICTED)
    remind = Move("remind", [State.ORDERED], State.ORDERED)
    remind_clash = Move("remind_clash", [State.CONFLICTED], State.CONFLICTED)
    hold = Move("hold", [State.ORDERED], State.ORDERED)
    note_open_failure = Move("note_open_failure", [State.OPEN], State.OPEN)
    note_ordered_failure = Move("note_ordered_failure", [State.ORDERED], State.ORDERED)
    end = Move("end", [State.OPEN, State.ORDERED, State.CONFLICTED, State.PASSED, State.LEFT], State.GONE)
