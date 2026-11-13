from datetime import timedelta
from types import SimpleNamespace

from engine.time.timestamp import Timestamp
from suites.coding.modules.workers.commands.remind_behind_updates.remind_behind_updates import RemindBehindUpdates
from suites.coding.modules.workers.commands.remind_behind_updates.remind_behind_updates_handler import RemindBehindUpdatesHandler
from suites.coding.modules.workers.models.enums.behind_check_state import BehindCheckState as State
from suites.coding.modules.workers.support.behind_checks import BehindChecks
from suites.coding.modules.workers.support.worker_settings import STALE_CHECK_COMMITS, UPDATE_REMINDERS, UPDATE_WAIT_MINUTES
from tests.unit.suites.coding.modules.workers.support.test_behind_checks import Queries, Settings as LookSettings, check, worktree
from tests.unit.suites.coding.modules.workers.test_update_reminders import ORDERED_AT, Lines, NoMarkers, Numbers, Rows, Settings, Store


def test_raising_the_threshold_above_an_open_check_opens_no_new_one_and_leaves_the_open_one():
    settings = LookSettings()
    settings.values[STALE_CHECK_COMMITS] = 5
    opened = check(State.OPEN, behind=3)
    checks = BehindChecks(Queries(WorktreeBehindCheck=[opened]), settings)
    assert checks.opens(worktree(), 4) is False and opened.state is State.OPEN


def test_turning_the_look_off_still_reminds_an_ordered_update():
    settings, store, nudger = Settings(2), Store(), Lines()
    settings.values[STALE_CHECK_COMMITS] = 0
    RemindBehindUpdatesHandler(store, Rows(False), store, settings, nudger, Lines(), Numbers(), NoMarkers()).handle(
        RemindBehindUpdates(), SimpleNamespace(timestamp=Timestamp(ORDERED_AT + timedelta(minutes=30))))
    assert len(nudger.sent) == 1


def test_a_changed_wait_and_number_of_reminders_apply_at_the_next_reminder():
    settings, store, nudger, inbox = Settings(2), Store(), Lines(), Lines()
    handler = RemindBehindUpdatesHandler(store, Rows(False), store, settings, nudger, inbox, Numbers(), NoMarkers())
    handler.handle(RemindBehindUpdates(), SimpleNamespace(timestamp=Timestamp(ORDERED_AT + timedelta(minutes=30))))
    settings.values[UPDATE_WAIT_MINUTES] = 10
    settings.values[UPDATE_REMINDERS] = 1
    handler.handle(RemindBehindUpdates(), SimpleNamespace(timestamp=Timestamp(ORDERED_AT + timedelta(minutes=40))))
    assert (len(nudger.sent), len(inbox.sent)) == (1, 1)
