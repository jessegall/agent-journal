from engine.errors.refusal import Refusal
from engine.execution.classes.execution_class import ExecutionClass


class ExecutionClassCostError(Refusal):
    """Raised when a class costs more slot units than its lane holds, so it could never start."""

    def __init__(self, execution_class: ExecutionClass, lane_capacity: int) -> None:
        super().__init__(f"{execution_class.name} costs {execution_class.slot_cost} but the {execution_class.lane} lane holds {lane_capacity}",
                         "lower the cost or raise the capacity")
