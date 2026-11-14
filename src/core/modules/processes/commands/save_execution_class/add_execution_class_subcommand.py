from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.enums.execution_lane import ExecutionLane
from engine.enums.execution_priority import ExecutionPriority
from engine.errors.refusal import Refusal
from engine.execution.classes.execution_class import ExecutionClass
from engine.subcommand.subcommand import Subcommand
from core.modules.processes.commands.save_execution_class.save_execution_class import SaveExecutionClass
from core.modules.processes.support.execution_class_options import ExecutionClassOptions


class AddExecutionClassSubcommand(Subcommand[SaveExecutionClass, str]):
    """`journal queue-class add <name> --pattern "docker build*" | --plugin <name>` with --lane --cost --priority
    --limit: a class of your own, which wins over the built-in ones for the lines it holds."""

    cli_name = "queue-class"
    name = "add"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("class_name")
        parser.add_argument("--pattern", default="", help="a regular expression a line matches")
        parser.add_argument("--plugin", default="", help="the plugin whose runs it holds")
        ExecutionClassOptions.add_arguments(parser)

    def command(self, arguments: Namespace, caller: Caller) -> SaveExecutionClass:
        if not arguments.pattern and not arguments.plugin:
            raise Refusal("a class of your own names the lines it holds", "add --pattern \"<regular expression>\" or --plugin <name>")
        start = ExecutionClass(arguments.class_name, ExecutionLane.LONG, 1, ExecutionPriority.AGENT, line_pattern=arguments.pattern, plugin=arguments.plugin)
        return SaveExecutionClass(ExecutionClassOptions.changed(start, arguments), is_override=False)
