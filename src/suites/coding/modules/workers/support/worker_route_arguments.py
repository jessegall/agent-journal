from argparse import ArgumentParser, BooleanOptionalAction, Namespace

from engine.profile.model_tier import ModelTier
from core.modules.tasks.models.support.task_complexity import TaskComplexity
from suites.coding.modules.workers.support.worker_route_values import WorkerRouteValues


class WorkerRouteArguments:
    """The route flags shared by make and edit."""

    @staticmethod
    def add(parser: ArgumentParser) -> None:
        parser.add_argument("--program")
        parser.add_argument("--tags", nargs="+", action="extend")
        parser.add_argument("--complexity-from", dest="minimum_complexity", type=TaskComplexity)
        parser.add_argument("--complexity-to", dest="maximum_complexity", type=TaskComplexity)
        parser.add_argument("--tier", type=ModelTier.automatic)
        parser.add_argument("--strict", action=BooleanOptionalAction, default=None)

    @staticmethod
    def values(arguments: Namespace) -> WorkerRouteValues:
        values = WorkerRouteValues()
        if arguments.program is not None:
            values["program"] = arguments.program
        if arguments.tags is not None:
            values["tags"] = tuple(dict.fromkeys(word for value in arguments.tags for word in value.split(",")))
        if arguments.minimum_complexity is not None:
            values["minimum_complexity"] = arguments.minimum_complexity
        if arguments.maximum_complexity is not None:
            values["maximum_complexity"] = arguments.maximum_complexity
        if arguments.tier is not None:
            values["tier"] = arguments.tier
        if arguments.strict is not None:
            values["strict"] = arguments.strict
        return values
