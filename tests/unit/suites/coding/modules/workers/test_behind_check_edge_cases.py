from dataclasses import replace
from datetime import timedelta
from types import SimpleNamespace

from engine.time.timestamp import Timestamp
from suites.coding.modules.workers.commands.remind_behind_updates.remind_behind_updates import RemindBehindUpdates
from suites.coding.modules.workers.commands.remind_behind_updates.remind_behind_updates_handler import RemindBehindUpdatesHandler
from suites.coding.modules.workers.listeners.behind_check_gone_listener import BehindCheckGoneListener
from suites.coding.modules.workers.models.enums.behind_check_state import BehindCheckState as State
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.support.behind_check_closing import BehindCheckClosing
from tests.unit.suites.coding.modules.workers.support.test_behind_check_closing import WORKTREE
from tests.unit.suites.coding.modules.workers.support.test_behind_check_closing import Store as Checks
from tests.unit.suites.coding.modules.workers.test_update_reminders import ORDERED_AT, NoMarkers, Numbers, Settings, Store

NEW_OWNER = 9


class Away:
    """A worker paused or stopped until the given minute, then back."""

    def __init__(self, until_minute: int, owner: int = WORKTREE.session_agent_id, field: str = "paused_at") -> None:
        self.until, self.owner, self.field, self.now = until_minute, owner, field, 0

    def required(self, model: type, row_id: int):
        if model.__name__ == "Worktree":
            return replace(WORKTREE, session_agent_id=self.owner)
        away = ORDERED_AT if self.now < self.until else None
        return SimpleNamespace(paused_at=away if self.field == "paused_at" else None, ended_at=away if self.field == "ended_at" else None)


class Sent:
    def __init__(self) -> None:
        self.to: list[int] = []

    def send(self, agent_id, declaration, source, context, **fields) -> None:
        self.to.append(agent_id)

    def send_nudge(self, nudge, source, context) -> None:
        self.to.append(0)


def reminded_at(minutes: list[int], rows: Away) -> list[tuple[int, int]]:
    store, nudger = Store(), Sent()
    handler = RemindBehindUpdatesHandler(store, rows, store, Settings(2), nudger, Sent(), Numbers(), NoMarkers())
    delivered = []
    for minute in minutes:
        rows.now = minute
        previous = len(nudger.to)
        handler.handle(RemindBehindUpdates(), SimpleNamespace(timestamp=Timestamp(ORDERED_AT + timedelta(minutes=minute))))
        delivered += [(minute, agent_id) for agent_id in nudger.to[previous:]]
    return delivered


def test_a_paused_worker_gets_no_reminder_and_its_wait_starts_again_when_it_is_back():
    assert reminded_at([30, 40, 45, 60, 75], Away(until_minute=45)) == [(75, WORKTREE.session_agent_id)]


def test_a_stopped_worker_keeps_its_order_and_is_reminded_only_a_wait_after_it_is_back():
    assert reminded_at([30, 60, 90, 110, 130], Away(until_minute=100, field="ended_at")) == [(130, WORKTREE.session_agent_id)]


def test_after_a_takeover_the_reminder_goes_to_the_new_owner_of_the_worktree():
    assert reminded_at([30], Away(until_minute=0, owner=NEW_OWNER)) == [(30, NEW_OWNER)]


def test_a_worktree_released_or_retired_closes_its_open_or_ordered_check_as_gone():
    assert WorktreeLifecycle.abandon in BehindCheckGoneListener.moves and WorktreeLifecycle.remove in BehindCheckGoneListener.moves
    checks = Checks(State.OPEN, State.ORDERED)
    BehindCheckClosing(checks, checks).close_removed(WORKTREE, None)
    assert checks.states() == [State.GONE, State.GONE]


def test_an_update_refused_during_a_merge_leaves_the_check_ordered_with_the_reason():
    checks = Checks(State.ORDERED)
    BehindCheckClosing(checks, checks).failed(WORKTREE, "a merge is in progress, settle it and commit first", None)
    assert (checks.states(), checks.rows[1].failure) == ([State.ORDERED], "a merge is in progress, settle it and commit first")
