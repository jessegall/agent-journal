from pathlib import Path

import pytest

from engine.database.never_waiting_write_turns import NeverWaitingWriteTurns
from engine.enums.execution_lane import ExecutionLane
from engine.enums.execution_priority import ExecutionPriority
from engine.enums.process_type import ProcessType
from engine.enums.starter_type import StarterType
from engine.execution.execution_order import ExecutionOrder
from engine.execution.limits.default_lane_limits import DEFAULT_LANE_LIMITS
from engine.journal.journal_home import JournalHome
from engine.process.door.execution_admission import ExecutionAdmission
from engine.process.door.execution_request import ExecutionRequest
from engine.process.door.placed_run import PlacedRun
from engine.time.clock import Clock
from server.execution.execution_priorities import ExecutionPriorities
from server.execution.execution_queue import ExecutionQueue
from server.execution.session_starters import SessionStarters
from server.execution.ticket_admission import TicketAdmission

GIT_STATUS = ExecutionRequest(["git", "status", "--short"], Path("/work"), ProcessType.QUICK, 10)


def admission(tmp_path) -> TicketAdmission:
    return TicketAdmission(ExecutionQueue(ExecutionOrder(DEFAULT_LANE_LIMITS), Clock()), ExecutionPriorities(SessionStarters(JournalHome(tmp_path))), Clock())


def test_quick_git_run_is_admitted_in_the_short_lane(tmp_path):
    door = admission(tmp_path)
    with door.admitted(PlacedRun(GIT_STATUS, None, False)):
        entries = door.queue.read()
    assert [(entry.ticket.execution_class.lane, entry.ticket.execution_class.name) for entry in entries] == [(ExecutionLane.SHORT, "journal short git")]


def test_run_gets_its_class_and_starter(tmp_path):
    door = admission(tmp_path)
    with door.admitted(PlacedRun(GIT_STATUS, None, False)):
        ticket = door.queue.read()[0].ticket
    assert (ticket.starter.starter_type, ticket.priority, ticket.line) == (StarterType.JOURNAL, ExecutionPriority.NORMAL, "git status --short")


def test_ticket_released_when_the_run_fails(tmp_path):
    door = admission(tmp_path)
    with pytest.raises(OSError), door.admitted(PlacedRun(GIT_STATUS, None, False)):
        raise OSError("git is missing")
    assert door.queue.read() == ()


def test_a_merge_row_takes_no_short_ticket(tmp_path):
    door = admission(tmp_path)
    with door.admitted(PlacedRun(ExecutionRequest(["git", "merge", "worker"], Path("/work"), ProcessType.MERGE, 60), 7, True)):
        assert door.queue.read() == ()


def test_a_run_inside_a_write_turn_starts_at_once(tmp_path):
    door = admission(tmp_path)
    with NeverWaitingWriteTurns().write_turn(), door.admitted(PlacedRun(GIT_STATUS, None, False)):
        assert door.queue.read()[0].ticket.priority is ExecutionPriority.IMMEDIATE


def test_stopped_server_admission_never_waits(tmp_path):
    with ExecutionAdmission(JournalHome(tmp_path)).admitted(PlacedRun(GIT_STATUS, None, False)) as admitted:
        assert admitted is None
