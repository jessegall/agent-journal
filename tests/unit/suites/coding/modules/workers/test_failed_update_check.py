from suites.coding.modules.workers.commands.record_failed_update.record_failed_update import RecordFailedUpdate
from suites.coding.modules.workers.commands.record_failed_update.record_failed_update_handler import RecordFailedUpdateHandler
from suites.coding.modules.workers.models.enums.behind_check_state import BehindCheckState as State
from suites.coding.modules.workers.support.behind_check_closing import BehindCheckClosing
from suites.coding.modules.workers.support.behind_nudges import UPDATE_FAILED_FOR_MERGER
from tests.unit.suites.coding.modules.workers.test_behind_check_closing import WORKTREE, Store

REASONS = ("branch version-5 does not exist in /work", "after the rebase, git stash apply failed: they stay in its stash abc123", "git rebase took longer than 60 seconds")


class Worktrees:
    def required_worker_worktree(self, worker_id: int):
        return WORKTREE


class Inbox:
    def __init__(self) -> None:
        self.sent: list[object] = []

    def send_nudge(self, nudge, source, context) -> None:
        self.sent.append(nudge)


class Numbers:
    def number(self, model: str, row_id: int) -> int:
        return 4


def failed(store: Store, inbox: Inbox, reason: str) -> None:
    RecordFailedUpdateHandler(Worktrees(), BehindCheckClosing(store, store), inbox, Numbers()).handle(RecordFailedUpdate(7, reason), None)


def test_each_failed_update_keeps_the_check_where_it_was_and_notes_why():
    for state in (State.OPEN, State.ORDERED):
        for reason in REASONS:
            store, inbox = Store(state), Inbox()
            failed(store, inbox, reason)
            assert (store.states(), store.rows[1].failure) == ([state], reason)


def test_the_merger_hears_once_per_failure_with_the_worker_and_the_check_that_keeps_the_reason():
    store, inbox = Store(State.ORDERED), Inbox()
    failed(store, inbox, REASONS[1])
    assert "stash abc123" in store.rows[1].failure
    failed(store, inbox, REASONS[2])
    assert [nudge.key for nudge in inbox.sent] == [UPDATE_FAILED_FOR_MERGER.key] * 2
    assert "worker:4" in inbox.sent[0].text and "journal behind-check show 1 says why" in inbox.sent[0].text


def test_with_no_check_to_settle_a_failure_tells_no_one():
    store, inbox = Store(State.UPDATED), Inbox()
    failed(store, inbox, REASONS[0])
    assert inbox.sent == []


def test_a_later_successful_update_closes_the_failed_check_as_updated():
    store, inbox = Store(State.ORDERED), Inbox()
    failed(store, inbox, REASONS[0])
    BehindCheckClosing(store, store).close_updated(WORKTREE, None)
    assert store.states() == [State.UPDATED]
