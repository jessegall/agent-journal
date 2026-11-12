from dataclasses import replace
from datetime import datetime, timedelta, timezone
from types import SimpleNamespace

from engine.time.timestamp import Timestamp
from suites.coding.modules.workers.commands.remind_behind_updates.remind_behind_updates import RemindBehindUpdates
from suites.coding.modules.workers.commands.remind_behind_updates.remind_behind_updates_handler import RemindBehindUpdatesHandler
from suites.coding.modules.workers.models.enums.behind_check_state import BehindCheckState as State
from suites.coding.modules.workers.models.worktree_behind_check import WorktreeBehindCheck
from suites.coding.modules.workers.support.behind_nudges import UPDATE_NOT_RUN, UPDATE_REMINDER
from suites.coding.modules.workers.support.worker_settings import UPDATE_REMINDERS, UPDATE_WAIT_MINUTES
from tests.unit.suites.coding.modules.workers.test_behind_check_closing import WORKTREE

ORDERED_AT = datetime(2026, 11, 12, 9, 0, tzinfo=timezone.utc)


class Store:
    """One check, read by state and saved with the time of the save, as the repository stamps it."""

    def __init__(self, state: State = State.ORDERED) -> None:
        self.check = WorktreeBehindCheck(id=1, environment_id=1, worktree_id=1, base_tip="abc", behind=4, state=state, updated_at=Timestamp(ORDERED_AT))

    def query(self, model: type) -> "Store":
        return self

    def filter(self, **values: object) -> "Store":
        self.wanted = values.get("state")
        return self

    def all_rows(self) -> list[WorktreeBehindCheck]:
        return [self.check] if self.check.state is self.wanted else []

    def save_change(self, row, changed, context):
        self.check = replace(changed, updated_at=context.timestamp)
        return self.check


class Rows:
    def __init__(self, paused: bool) -> None:
        self.paused = paused

    def required(self, model: type, row_id: int):
        return WORKTREE if model.__name__ == "Worktree" else SimpleNamespace(paused_at=ORDERED_AT if self.paused else None, ended_at=None)


class Settings:
    def __init__(self, reminders: int) -> None:
        self.values = {UPDATE_WAIT_MINUTES: 30, UPDATE_REMINDERS: reminders}

    def number(self, key: str) -> int:
        return self.values[key]


class Lines:
    def __init__(self) -> None:
        self.sent: list[object] = []

    def send(self, agent_id, declaration, source, context, **fields) -> None:
        self.sent.append(declaration.key)

    def send_nudge(self, nudge, source, context) -> None:
        self.sent.append(nudge.key)


class NoMarkers:
    def conflict_files(self, worktree) -> tuple[str, ...]:
        return ()


class Numbers:
    def number(self, model: str, row_id: int) -> int:
        return 4


def run_at(minutes: list[int], store: Store | None = None, paused: bool = False, reminders: int = 2) -> tuple[list[object], list[object], Store]:
    store, nudger, inbox = store or Store(), Lines(), Lines()
    handler = RemindBehindUpdatesHandler(store, Rows(paused), store, Settings(reminders), nudger, inbox, Numbers(), NoMarkers())
    for minute in minutes:
        handler.handle(RemindBehindUpdates(), SimpleNamespace(timestamp=Timestamp(ORDERED_AT + timedelta(minutes=minute))))
    return nudger.sent, inbox.sent, store


def test_a_worker_is_reminded_at_thirty_and_sixty_minutes_and_not_a_third_time_then_the_merger_hears_once():
    reminded, merger, store = run_at([10, 30, 45, 60, 90, 120, 150])
    assert (reminded, merger) == ([UPDATE_REMINDER.key, UPDATE_REMINDER.key], [UPDATE_NOT_RUN.key])


def test_a_paused_worker_is_not_reminded():
    assert run_at([30, 60, 90], paused=True)[:2] == ([], [])


def test_a_closed_check_is_not_reminded():
    assert run_at([30, 60, 90], store=Store(State.UPDATED))[:2] == ([], [])


def test_with_no_reminders_the_merger_hears_at_once():
    assert run_at([30, 60], reminders=0)[:2] == ([], [UPDATE_NOT_RUN.key])
