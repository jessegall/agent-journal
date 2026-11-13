from dataclasses import replace
from datetime import datetime, timezone

from engine.enums.command_category import CommandCategory
from engine.enums.execution_lane import ExecutionLane
from engine.enums.execution_priority import ExecutionPriority
from engine.enums.starter_type import StarterType
from engine.execution.execution_classes import ExecutionClasses
from engine.time.clock import Clock
from engine.time.timestamp import Timestamp
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.process import Process
from core.modules.processes.support.execution_tickets import ExecutionTickets
from core.modules.processes.support.process_type_limits import ProcessTypeLimits

ENTERED = Timestamp(datetime(2026, 11, 13, 12, tzinfo=timezone.utc))
AGENTS = {1: Agent(id=1, creator_id=1, session="s-1", program="claude", role="main"), 2: Agent(id=2, creator_id=1, session="s-2", program="claude", role="worker")}


class SampleRows:
    """The agent rows of a test, found by id."""

    def required_index(self, model: type, ids: list[int]) -> dict[int, Agent]:
        return {number: AGENTS[number] for number in ids}


class SampleAdmission:
    """A reader admission that holds the runs a test names as waiting on an open reader request."""

    def __init__(self, waiting_on_reader: frozenset[int] = frozenset()) -> None:
        self.waiting_on_reader = waiting_on_reader

    def waiting_parts(self, waiting) -> dict:
        return {}

    def may_start(self, process: Process, agent: Agent, parts, current_time) -> bool:
        return process.id not in self.waiting_on_reader


class NoPersonClasses:
    """No class of the person's own."""

    def classes(self) -> tuple:
        return ()


def tickets(waiting_on_reader: frozenset[int] = frozenset()) -> ExecutionTickets:
    return ExecutionTickets(ExecutionClasses(NoPersonClasses()), ProcessTypeLimits(), SampleAdmission(waiting_on_reader), SampleRows(), Clock())  # type: ignore[arg-type]


def process(number: int, agent: int, category: CommandCategory, waiting: bool, execution_class: str = "") -> Process:
    return Process(id=number, session_agent_id=agent, creator_id=1, line="pytest" if category is CommandCategory.TEST_RUN else "grep x", folder=".",
                   category=category, limit_seconds=60, queued_at=ENTERED if waiting else None, started_at=None if waiting else ENTERED,
                   execution_class=execution_class, priority=ExecutionPriority.AGENT, first_priority=ExecutionPriority.AGENT, created_at=ENTERED)


def test_waiting_rows_become_waiting_tickets():
    lane = tickets().of_rows([process(1, 2, CommandCategory.TEST_RUN, waiting=True)], ExecutionLane.LONG)
    assert (len(lane.waiting), len(lane.running)) == (1, 0)


def test_started_rows_are_running_tickets():
    lane = tickets().of_rows([process(1, 2, CommandCategory.TEST_RUN, waiting=False)], ExecutionLane.LONG)
    assert (len(lane.waiting), len(lane.running)) == (0, 1)


def test_starter_comes_from_the_agent_role():
    lane = tickets().of_rows([process(1, 1, CommandCategory.TEST_RUN, waiting=True), process(2, 2, CommandCategory.TEST_RUN, waiting=True)], ExecutionLane.LONG)
    assert [ticket.starter.starter_type for ticket in lane.waiting] == [StarterType.MAIN_AGENT, StarterType.HELPER]


def test_reader_request_sets_waits_for_reader():
    lane = tickets(frozenset({1})).of_rows([process(1, 2, CommandCategory.TEST_RUN, waiting=True)], ExecutionLane.LONG)
    assert lane.waiting[0].has_open_reader_request


def test_row_without_a_class_is_matched():
    lane = tickets().of_rows([process(1, 2, CommandCategory.SEARCH, waiting=True)], ExecutionLane.SHORT)
    assert lane.waiting[0].execution_class.name == "agent short line"


def moved(number: int, category: CommandCategory) -> Process:
    return replace(process(number, 2, category, waiting=False), state=ProcessState.BACKGROUND, moved_at=ENTERED)


def test_move_frees_the_short_slot():
    assert tickets().of_rows([moved(1, CommandCategory.SEARCH)], ExecutionLane.SHORT).running == ()


def test_moved_row_counts_in_the_long_lane():
    long_lane = tickets().of_rows([moved(1, CommandCategory.SEARCH)], ExecutionLane.LONG)
    assert [(ticket.execution_class.lane, ticket.execution_class.slot_cost) for ticket in long_lane.running] == [(ExecutionLane.LONG, 1)]
