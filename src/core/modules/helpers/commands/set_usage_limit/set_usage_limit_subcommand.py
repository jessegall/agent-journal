from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.helpers.commands.set_usage_limit.set_usage_limit import SetUsageLimit
from core.modules.helpers.models.enums.usage_limit_mode import UsageLimitMode
from core.modules.helpers.models.enums.usage_limit_window import UsageLimitWindow
from core.modules.helpers.models.usage_limit import UsageLimit


class SetUsageLimitSubcommand(Subcommand[SetUsageLimit, UsageLimit]):
    """`journal usage-limit set <program> <window> <fixed|budget> <percent>`: halts the program's agents at that percent of the
    window ("5 hours", "7 days" or "hour"), or after that many percent more than it holds now; the same window and mode again changes the limit."""

    cli_name = "usage-limit"
    name = "set"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("program")
        parser.add_argument("window", type=UsageLimitWindow, choices=list(UsageLimitWindow))
        parser.add_argument("mode", type=UsageLimitMode, choices=list(UsageLimitMode))
        parser.add_argument("percent", type=float)

    def command(self, arguments: Namespace, caller: Caller) -> SetUsageLimit:
        return SetUsageLimit(arguments.program, arguments.window, arguments.mode, arguments.percent)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, UsageLimit):
            output.line(f"usage limit {value.id}: {value.program} {value.window.value} {value.mode.value} {value.percent:g}%")
