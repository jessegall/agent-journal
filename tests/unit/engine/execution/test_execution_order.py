from dataclasses import replace

from engine.enums.execution_lane import ExecutionLane
from engine.enums.execution_priority import ExecutionPriority
from engine.enums.starter_type import StarterType
from engine.execution.default_lane_limits import DEFAULT_LANE_LIMITS
from engine.execution.execution_class import ExecutionClass
from engine.execution.execution_starter import ExecutionStarter
from engine.execution.execution_ticket import ExecutionTicket
from engine.execution.execution_order import ExecutionOrder
from tests.unit.engine.execution.tickets import seconds_after_start, ticket

# one starter holds every sample ticket, so the share per starter is lifted except where a test is about it
ORDER = ExecutionOrder(replace(DEFAULT_LANE_LIMITS, starter_caps=dict(DEFAULT_LANE_LIMITS.capacities)))
CHECK_TIME = seconds_after_start(0)
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


def starter(number: int) -> ExecutionStarter:
    return ExecutionStarter(StarterType.HELPER, agent_id=number, agent_role="worker")


def raised_priority(waiting_ticket, seconds: float, is_halted: bool = False) -> ExecutionPriority:
    return ORDER.raised([waiting_ticket], seconds_after_start(seconds), is_halted)[0].priority


def test_wait_past_step_raises_one_step():
    assert raised_priority(ticket(NORMAL), 10) is AGENT


def test_raised_wait_starts_again():
    raised = ORDER.raised([ticket(NORMAL)], seconds_after_start(12), False)[0]
    assert raised.raised_at == seconds_after_start(10)


def test_two_steps_pass_raises_twice():
    assert raised_priority(ticket(NORMAL), 15) is RESERVED


def test_raise_never_reaches_immediate():
    assert raised_priority(ticket(BACKGROUND), 3600) is RESERVED


def test_raise_stops_at_reserved():
    assert raised_priority(ticket(RESERVED), 3600) is RESERVED


def test_raised_ticket_still_counts_as_first_priority():
    raised = ORDER.raised([ticket(NORMAL)], seconds_after_start(10), False)[0]
    assert (raised.first_priority, raised.priority) == (NORMAL, AGENT)


def test_reserved_past_wait_takes_next_room():
    overdue = replace(ticket(RESERVED, starter=starter(2), entered_second=5), raised_at=seconds_after_start(0))
    fresh = ticket(RESERVED, starter=starter(3), entered_second=3)
    full = [ticket(AGENT, starter=starter(10 + number)) for number in range(11)]
    assert ORDER.starting([fresh, overdue], full, seconds_after_start(4), False) == (overdue,)


def test_starter_cap_holds_while_other_starter_starts():
    held = [ticket(AGENT, starter=starter(1)) for _ in range(6)]
    capped, other = ticket(AGENT, starter=starter(1)), ticket(AGENT, starter=starter(2))
    assert list(ExecutionOrder(DEFAULT_LANE_LIMITS).starting([capped, other], held, CHECK_TIME, False)) == [other]


def test_class_at_limit_does_not_block_a_build_behind():
    merge_class = ExecutionClass("merge", ExecutionLane.LONG, 1, AGENT, class_limit=1)
    merge = ExecutionTicket(merge_class, AGENT, AGENT, starter(1), "merge", seconds_after_start(0), seconds_after_start(0))
    build = ticket(AGENT, lane=ExecutionLane.LONG, slot_cost=1, starter=starter(2), entered_second=1)
    assert started_tickets([merge, build], [replace(merge, starter=starter(3))]) == [build]


def test_waits_for_reader_is_passed_over_and_still_raised():
    waiting_reader = replace(ticket(NORMAL), has_open_reader_request=True)
    assert started_tickets([waiting_reader], []) == []
    assert raised_priority(waiting_reader, 10) is AGENT


def test_halted_lane_starts_none_and_counts_no_wait():
    waiting = ticket(NORMAL, lane=ExecutionLane.LONG)
    assert ORDER.starting([waiting], [], seconds_after_start(3600), True) == ()
    assert raised_priority(waiting, 3600, is_halted=True) is NORMAL


def test_immediate_ceiling_is_flagged_not_refused():
    many = [ticket(IMMEDIATE, starter=starter(number)) for number in range(65)]
    assert ORDER.over_ceiling(many) and started_tickets([ticket(IMMEDIATE)], many) != []


def test_nothing_waits_forever_under_a_steady_stream():
    first = ticket(NORMAL, starter=starter(1), line="first")
    second, running = 0, [ticket(AGENT, starter=starter(10 + number), entered_second=0) for number in range(8)]
    while second < 60:
        second += 1
        stream = [ticket(AGENT, starter=starter(100 + second), entered_second=second)]
        if any(started.line == "first" for started in ORDER.starting([first, *stream], running, seconds_after_start(second), False)):
            break
        running = [*running[1:], ticket(AGENT, starter=starter(200 + second), entered_second=second)]
    assert second <= 10 + 5 + 2 + 1
