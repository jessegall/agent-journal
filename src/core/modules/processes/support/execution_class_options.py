from argparse import ArgumentParser, Namespace
from dataclasses import replace

from engine.enums.execution_length import ExecutionLength
from engine.enums.execution_priority import ExecutionPriority
from engine.errors.refusal import Refusal
from engine.execution.classes.execution_class import UNLIMITED, ExecutionClass


class ExecutionClassOptions:
    """The flags that change a class, read the one way for set and add: an unknown lane or priority is refused
    naming the valid ones, and a flag left out keeps what the class has."""

    @staticmethod
    def add_arguments(parser: ArgumentParser) -> None:
        parser.add_argument("--lane", dest="pool", default=None, help=f"one of {', '.join(pool.value for pool in ExecutionLength)}")
        parser.add_argument("--cost", type=int, default=None, help="slot units it takes in its lane")
        parser.add_argument("--priority", default=None, help=f"one of {', '.join(priority.label for priority in ExecutionPriority)}")
        parser.add_argument("--limit", type=int, default=None, help="how many of the class run at once; 0 for no limit")

    @staticmethod
    def changed(execution_class: ExecutionClass, arguments: Namespace) -> ExecutionClass:
        return replace(execution_class,
                       pool=execution_class.pool if arguments.pool is None else ExecutionClassOptions.pool(arguments.pool),
                       priority=execution_class.priority if arguments.priority is None else ExecutionClassOptions.priority(arguments.priority),
                       slot_cost=execution_class.slot_cost if arguments.cost is None else arguments.cost,
                       class_limit=execution_class.class_limit if arguments.limit is None else arguments.limit or UNLIMITED)

    @staticmethod
    def pool(text: str) -> ExecutionLength:
        if text not in {pool.value for pool in ExecutionLength}:
            raise Refusal(f"{text} is no lane", f"name one of {', '.join(pool.value for pool in ExecutionLength)}")
        return ExecutionLength(text)

    @staticmethod
    def priority(text: str) -> ExecutionPriority:
        if text.upper() not in ExecutionPriority.__members__:
            raise Refusal(f"{text} is no priority", f"name one of {', '.join(priority.label for priority in ExecutionPriority)}")
        return ExecutionPriority.labelled(text)
