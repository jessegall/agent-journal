from argparse import ArgumentParser, BooleanOptionalAction, Namespace

from core.base.profile.model_tier import ModelTier
from core.modules.tasks.models.support.task_complexity import TaskComplexity


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
    def values(arguments: Namespace) -> dict[str, object]:
        values = {field: getattr(arguments, field) for field in
                  ("program", "tags", "minimum_complexity", "maximum_complexity", "tier", "strict")
                  if getattr(arguments, field) is not None}
        if arguments.tags is not None:
            values["tags"] = tuple(dict.fromkeys(word for value in arguments.tags for word in value.split(",")))
        return values
