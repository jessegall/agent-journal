from dataclasses import replace

from engine.enums.command_category import CommandCategory
from engine.enums.execution_lane import ExecutionLane
from engine.enums.execution_priority import ExecutionPriority
from engine.enums.execution_source import ExecutionSource
from engine.enums.starter_type import StarterType
from engine.execution.execution_order import ExecutionOrder
from engine.execution.execution_starter import ExecutionStarter
from engine.execution.execution_subject import ExecutionSubject
from engine.execution.execution_ticket import ExecutionTicket
from engine.execution.limits.default_lane_limits import DEFAULT_LANE_LIMITS
from tests.unit.engine.execution.classes.test_execution_classes import CLASSES, WORKER
from tests.unit.engine.execution.tickets import seconds_after_start

MAIN_AGENT = ExecutionStarter(StarterType.MAIN_AGENT, agent_id=1)
ROOMY_LONG_LANE = 32
ROOMY = ExecutionOrder(replace(DEFAULT_LANE_LIMITS.with_capacities({**DEFAULT_LANE_LIMITS.capacities, ExecutionLane.LONG: ROOMY_LONG_LANE}),
                               starter_caps={lane: ROOMY_LONG_LANE for lane in ExecutionLane}))
GRAPHIFY = CLASSES.match(ExecutionSubject(ExecutionSource.GRAPHIFY, MAIN_AGENT, category=CommandCategory.BACKGROUND_JOB))
BUILD = CLASSES.match(ExecutionSubject(ExecutionSource.SHELL_LINE, WORKER, category=CommandCategory.BUILD))


def update(entered_second: float, run_id: int) -> ExecutionTicket:
    return ExecutionTicket(GRAPHIFY, GRAPHIFY.priority, GRAPHIFY.priority, MAIN_AGENT, "graphify update .", seconds_after_start(entered_second), seconds_after_start(entered_second), run_id=run_id)


def test_update_takes_cost_eight():
    assert (GRAPHIFY.lane, GRAPHIFY.slot_cost, GRAPHIFY.class_limit, GRAPHIFY.priority) == (ExecutionLane.LONG, 8, 1, ExecutionPriority.BACKGROUND)


def test_second_update_waits_on_the_class_limit():
    assert ROOMY.starting([update(1, 2)], [update(0, 1)], seconds_after_start(2), False) == ()


def test_a_build_behind_a_waiting_update_is_not_blocked_by_the_class_limit_alone():
    build = ExecutionTicket(BUILD, BUILD.priority, BUILD.priority, WORKER, "make build", seconds_after_start(2), seconds_after_start(2), run_id=3)
    assert ROOMY.starting([update(1, 2), build], [update(0, 1)], seconds_after_start(3), False) == (build,)


def test_an_update_starts_in_the_default_long_lane_though_it_costs_more_than_the_background_share():
    assert ExecutionOrder(replace(DEFAULT_LANE_LIMITS, starter_caps=dict(DEFAULT_LANE_LIMITS.capacities))).starting([update(0, 1)], [], seconds_after_start(1), False) == (update(0, 1),)
