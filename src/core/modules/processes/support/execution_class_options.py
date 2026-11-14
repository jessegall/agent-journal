from argparse import ArgumentParser, Namespace
from dataclasses import replace

from engine.enums.execution_lane import ExecutionLane
from engine.enums.execution_priority import ExecutionPriority
from engine.errors.refusal import Refusal
from engine.execution.classes.execution_class import UNLIMITED, ExecutionClass


class ExecutionClassOptions:
    """The flags that change a class, read the one way for set and add: an unknown lane or priority is refused
    naming the valid ones, and a flag left out keeps what the class has."""

    @staticmethod
    def add_arguments(parser: ArgumentParser) -> None:
        parser.add_argument("--lane", default=None, help=f"one of {', '.join(lane.value for lane in ExecutionLane)}")
        parser.add_argument("--cost", type=int, default=None, help="slot units it takes in its lane")
        parser.add_argument("--priority", default=None, help=f"one of {', '.join(priority.label for priority in ExecutionPriority)}")
        parser.add_argument("--limit", type=int, default=None, help="how many of the class run at once; 0 for no limit")

    @staticmethod
    def changed(execution_class: ExecutionClass, arguments: Namespace) -> ExecutionClass:
        values: dict[str, object] = {}
        if arguments.lane is not None:
            values["lane"] = ExecutionClassOptions.lane(arguments.lane)
        if arguments.priority is not None:
            values["priority"] = ExecutionClassOptions.priority(arguments.priority)
        if arguments.cost is not None:
            values["slot_cost"] = arguments.cost
        if arguments.limit is not None:
            values["class_limit"] = arguments.limit or UNLIMITED
        return replace(execution_class, **values)

    @staticmethod
    def lane(text: str) -> ExecutionLane:
        if text not in {lane.value for lane in ExecutionLane}:
            raise Refusal(f"{text} is no lane", f"name one of {', '.join(lane.value for lane in ExecutionLane)}")
        return ExecutionLane(text)

    @staticmethod
    def priority(text: str) -> ExecutionPriority:
        if text.upper() not in ExecutionPriority.__members__:
            raise Refusal(f"{text} is no priority", f"name one of {', '.join(priority.label for priority in ExecutionPriority)}")
        return ExecutionPriority.labelled(text)
