from dataclasses import replace

from engine.enums.execution_lane import ExecutionLane
from engine.enums.execution_priority import ExecutionPriority
from engine.execution.default_lane_limits import DEFAULT_LANE_LIMITS
from engine.execution.execution_order import ExecutionOrder
from tests.unit.engine.execution.tickets import seconds_after_start, ticket

ORDER = ExecutionOrder(DEFAULT_LANE_LIMITS)
CHECK_TIME = seconds_after_start(10)
IMMEDIATE, RESERVED, AGENT, NORMAL, BACKGROUND = (ExecutionPriority.IMMEDIATE, ExecutionPriority.RESERVED, ExecutionPriority.AGENT,
                                                  ExecutionPriority.NORMAL, ExecutionPriority.BACKGROUND)


def short_tickets(priority: ExecutionPriority, count: int) -> list:
    return [ticket(priority) for _ in range(count)]


def started_tickets(waiting: list, running: list) -> list:
    return list(ORDER.starting(waiting, running, CHECK_TIME, False))


def test_immediate_starts_in_a_full_lane():
    full = short_tickets(AGENT, 8) + short_tickets(NORMAL, 4)
    main_agent_read = ticket(IMMEDIATE)
    assert started_tickets([main_agent_read], full) == [main_agent_read]


def test_immediate_uses_free_room_first():
    running = short_tickets(NORMAL, 4) + short_tickets(RESERVED, 7)
    reserved, immediate = ticket(RESERVED, entered_second=0), ticket(IMMEDIATE, entered_second=5)
    assert started_tickets([reserved, immediate], running) == [immediate]


def test_immediate_runs_over_when_no_room():
    full = short_tickets(AGENT, 8) + short_tickets(NORMAL, 4)
    immediates = [ticket(IMMEDIATE, entered_second=1), ticket(IMMEDIATE, entered_second=2)]
    started = started_tickets(immediates, full)
    assert started == immediates
    assert ORDER.capacity_exceeded(full + started)


def test_higher_priority_goes_first():
    background, normal, reserved = (ticket(priority, entered_second=second) for second, priority in enumerate((BACKGROUND, NORMAL, RESERVED)))
    assert started_tickets([background, normal, reserved], short_tickets(AGENT, 8) + short_tickets(BACKGROUND, 2)) == [reserved, normal]


def test_equal_priority_goes_in_entry_order():
    running = short_tickets(AGENT, 7) + short_tickets(NORMAL, 4)
    last_entered, first_entered = ticket(AGENT, entered_second=5, line="pwd"), ticket(AGENT, entered_second=0, line="ls")
    assert started_tickets([last_entered, first_entered], running) == [first_entered]


def test_capacity_counts_slot_units():
    running = [ticket(AGENT, ExecutionLane.LONG, slot_cost=4)]
    first, second = ticket(AGENT, ExecutionLane.LONG, 4, 0, line="first"), ticket(AGENT, ExecutionLane.LONG, 4, 1, line="second")
    assert started_tickets([first, second], running) == [first]


def test_priority_at_limit_waits_even_with_room():
    assert started_tickets([ticket(NORMAL)], short_tickets(NORMAL, 4)) == []


def test_full_priority_does_not_block_lower():
    normal, background = ticket(NORMAL, entered_second=0), ticket(BACKGROUND, entered_second=5)
    assert started_tickets([normal, background], short_tickets(NORMAL, 4)) == [background]


def test_ticket_that_does_not_fit_is_passed_over():
    running = [ticket(AGENT, ExecutionLane.LONG, slot_cost=4), ticket(AGENT, ExecutionLane.LONG, slot_cost=2)]
    test_run, merge = ticket(AGENT, ExecutionLane.LONG, 4, 0), ticket(AGENT, ExecutionLane.LONG, 1, 5)
    assert started_tickets([test_run, merge], running) == [merge]


def test_running_limit_counts_first_priority():
    raised_normals = [replace(ticket(NORMAL), priority=AGENT) for _ in range(4)]
    normal, agent = ticket(NORMAL, entered_second=0), ticket(AGENT, entered_second=5)
    assert started_tickets([normal], raised_normals) == []
    assert started_tickets([agent], raised_normals) == [agent]


def test_capacity_exceeded_is_reported():
    assert not ORDER.capacity_exceeded([])
    assert not ORDER.capacity_exceeded(short_tickets(AGENT, 8) + short_tickets(NORMAL, 4))
    assert ORDER.capacity_exceeded(short_tickets(AGENT, 8) + short_tickets(NORMAL, 4) + [ticket(IMMEDIATE)])
