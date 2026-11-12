from datetime import timedelta
from types import SimpleNamespace

from engine.time.timestamp import Timestamp
from suites.coding.modules.workers.commands.remind_behind_updates.remind_behind_updates import RemindBehindUpdates
from suites.coding.modules.workers.commands.remind_behind_updates.remind_behind_updates_handler import RemindBehindUpdatesHandler
from suites.coding.modules.workers.models.enums.behind_check_state import BehindCheckState as State
from suites.coding.modules.workers.support.behind_nudges import CLASH_OPEN, CLASH_STILL_OPEN
from tests.unit.suites.coding.modules.workers.test_update_reminders import ORDERED_AT, Lines, Numbers, Rows, Settings, Store


class Markers:
    def __init__(self, files: tuple[str, ...]) -> None:
        self.files = files

    def conflict_files(self, worktree) -> tuple[str, ...]:
        return self.files


def merger_lines(minutes: list[int], files: tuple[str, ...]) -> tuple[list[object], Lines]:
    store, nudger, inbox = Store(State.CONFLICTED), Lines(), Lines()
    handler = RemindBehindUpdatesHandler(store, Rows(False), store, Settings(2), nudger, inbox, Numbers(), Markers(files))
    for minute in minutes:
        handler.handle(RemindBehindUpdates(), SimpleNamespace(timestamp=Timestamp(ORDERED_AT + timedelta(minutes=minute))))
    return inbox.sent, nudger


def test_markers_still_open_after_the_wait_reach_the_merger_once_to_advise_then_once_to_pass():
    sent, nudger = merger_lines([10, 30, 45, 60, 90, 120], ("cart.py",))
    assert (sent, nudger.sent) == ([CLASH_OPEN.key, CLASH_STILL_OPEN.key], [])


def test_the_lines_name_the_files_and_the_command_to_run():
    assert "markers open in cart.py, tax.py" in CLASH_OPEN.nudge(worker=4, files="cart.py, tax.py").text
    assert "journal merger pass 4" in CLASH_STILL_OPEN.nudge(worker=4, files="cart.py").text


def test_settled_markers_tell_the_merger_nothing():
    assert merger_lines([30, 60, 90], ())[0] == []
