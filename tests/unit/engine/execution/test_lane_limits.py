from engine.enums.execution_lane import ExecutionLane
from engine.enums.execution_priority import ExecutionPriority
from engine.execution.limits.default_lane_limits import DEFAULT_LANE_LIMITS
from engine.execution.classes.execution_class import UNLIMITED
from engine.execution.limits.priority_limit import PriorityLimit

DOCUMENT_TABLE = {
    ExecutionLane.INSTANT: [(3, 10), (6, 3), (12, 1), (16, 0.5)],
    ExecutionLane.SHORT: [(2, 30), (4, 10), (8, 5), (8, 2)],
    ExecutionLane.LONG: [(2, 600), (4, 300), (8, 120), (8, 60)],
}
LIMITED_PRIORITIES = [ExecutionPriority.BACKGROUND, ExecutionPriority.NORMAL, ExecutionPriority.AGENT, ExecutionPriority.RESERVED]


def test_defaults_match_the_document_table():
    assert [DEFAULT_LANE_LIMITS.capacity(lane) for lane in ExecutionLane] == [24, 12, 8]
    for lane, row in DOCUMENT_TABLE.items():
        assert [DEFAULT_LANE_LIMITS.priority_limit(lane, priority) for priority in LIMITED_PRIORITIES] == [PriorityLimit(*cell) for cell in row]
    assert DEFAULT_LANE_LIMITS.immediate_ceiling == 64


def test_per_starter_cap_is_half_a_lane():
    assert [DEFAULT_LANE_LIMITS.starter_cap(lane) for lane in ExecutionLane] == [12, 6, 4]


def test_unlimited_priority_has_no_limit():
    for lane in ExecutionLane:
        assert DEFAULT_LANE_LIMITS.priority_limit(lane, ExecutionPriority.IMMEDIATE) == PriorityLimit(UNLIMITED, 0)
