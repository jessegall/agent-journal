from engine.enums.execution_lane import ExecutionLane
from engine.enums.execution_priority import ExecutionPriority
from engine.execution.execution_class import UNLIMITED
from engine.execution.lane_limits import LaneLimits
from engine.execution.priority_limit import PriorityLimit
from engine.time.timestamp import MINUTE_SECONDS

# the only place the default load numbers of doc 1266 are written
DEFAULT_RUN_BATCH_SIZE = 2
RUN_SLOT_COST = 4
IMMEDIATE_LIMIT = PriorityLimit(UNLIMITED, 0)

DEFAULT_CAPACITIES = {
    ExecutionLane.INSTANT: 24,
    ExecutionLane.SHORT: 12,
    ExecutionLane.LONG: DEFAULT_RUN_BATCH_SIZE * RUN_SLOT_COST,
}

DEFAULT_PRIORITY_LIMITS = {
    ExecutionLane.INSTANT: {
        ExecutionPriority.BACKGROUND: PriorityLimit(3, 10),
        ExecutionPriority.NORMAL: PriorityLimit(6, 3),
        ExecutionPriority.AGENT: PriorityLimit(12, 1),
        ExecutionPriority.RESERVED: PriorityLimit(16, 0.5),
        ExecutionPriority.IMMEDIATE: IMMEDIATE_LIMIT,
    },
    ExecutionLane.SHORT: {
        ExecutionPriority.BACKGROUND: PriorityLimit(2, 30),
        ExecutionPriority.NORMAL: PriorityLimit(4, 10),
        ExecutionPriority.AGENT: PriorityLimit(8, 5),
        ExecutionPriority.RESERVED: PriorityLimit(8, 2),
        ExecutionPriority.IMMEDIATE: IMMEDIATE_LIMIT,
    },
    ExecutionLane.LONG: {
        ExecutionPriority.BACKGROUND: PriorityLimit(2, 10 * MINUTE_SECONDS),
        ExecutionPriority.NORMAL: PriorityLimit(4, 5 * MINUTE_SECONDS),
        ExecutionPriority.AGENT: PriorityLimit(DEFAULT_CAPACITIES[ExecutionLane.LONG], 2 * MINUTE_SECONDS),
        ExecutionPriority.RESERVED: PriorityLimit(DEFAULT_CAPACITIES[ExecutionLane.LONG], MINUTE_SECONDS),
        ExecutionPriority.IMMEDIATE: IMMEDIATE_LIMIT,
    },
}

DEFAULT_LANE_LIMITS = LaneLimits(
    capacities=DEFAULT_CAPACITIES,
    priority_limits=DEFAULT_PRIORITY_LIMITS,
    starter_caps={lane: capacity // 2 for lane, capacity in DEFAULT_CAPACITIES.items()},
    immediate_ceiling=64,
)
