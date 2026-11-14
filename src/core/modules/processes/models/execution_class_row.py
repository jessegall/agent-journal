from dataclasses import dataclass

from engine.enums.execution_lane import ExecutionLane
from engine.enums.execution_priority import ExecutionPriority
from engine.execution.classes.execution_class import UNLIMITED, ExecutionClass
from engine.model.model import Model


@dataclass(frozen=True, kw_only=True)
class ExecutionClassRow(Model):
    """A class the person added, or a built-in class the person changed: what it runs in, costs and starts with."""

    model_name = "execution_class"
    cli_name = "execution-class"

    name: str
    lane: ExecutionLane
    slot_cost: int
    priority: ExecutionPriority
    class_limit: int = UNLIMITED
    line_pattern: str = ""
    plugin: str = ""
    is_override: bool = False

    @property
    def execution_class(self) -> ExecutionClass:
        return ExecutionClass(self.name, self.lane, self.slot_cost, self.priority, self.class_limit, self.line_pattern, self.plugin)
