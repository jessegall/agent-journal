from datetime import timedelta
from types import SimpleNamespace

from engine.actor.actor import Actor
from engine.time.timestamp import Timestamp
from suites.coding.modules.workers.commands.remind_behind_updates.remind_behind_updates import RemindBehindUpdates
from suites.coding.modules.workers.commands.remind_behind_updates.remind_behind_updates_handler import RemindBehindUpdatesHandler
from suites.coding.modules.workers.models.enums.behind_check_state import BehindCheckState as State
from suites.coding.modules.workers.agent_messages.conflict_open_message import ConflictOpenMessage
from suites.coding.modules.workers.agent_messages.conflict_repeated_message import ConflictRepeatedMessage
from tests.unit.suites.coding.modules.workers.test_update_reminders import ORDERED_AT, Lines, Numbers, Rows, Settings, Store


class Markers:
    def __init__(self, files: tuple[str, ...]) -> None:
        self.files = files

    def conflict_files(self, worktree) -> tuple[str, ...]:
        return self.files


def merger_lines(minutes: list[int], files: tuple[str, ...]) -> tuple[list[object], Lines]:
    store, message_sender, inbox = Store(State.CONFLICTED), Lines(), Lines()
    handler = RemindBehindUpdatesHandler(store, Rows(False), store, Settings(2), message_sender, inbox, Numbers(), Markers(files))
    for minute in minutes:
        handler.prepare(RemindBehindUpdates(), Actor.core())
        handler.handle(RemindBehindUpdates(), SimpleNamespace(timestamp=Timestamp(ORDERED_AT + timedelta(minutes=minute))))
    return inbox.sent, message_sender


def test_markers_still_open_after_the_wait_reach_the_merger_once_to_advise_then_once_to_pass():
    delivered, message_sender = merger_lines([10, 30, 45, 60, 90, 120], tuple(["cart.py"]))
    assert (delivered, message_sender.sent) == ([ConflictOpenMessage.declared().key, ConflictRepeatedMessage.declared().key], [])


def test_the_lines_name_the_worker():
    assert "worker:4" in ConflictOpenMessage.declared().agent_message(worker=4).text and "worker:4" in ConflictRepeatedMessage.declared().agent_message(worker=4).text


def test_settled_markers_tell_the_merger_nothing():
    assert merger_lines([30, 60, 90], ())[0] == []
