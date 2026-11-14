from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.asks.commands.approve_ask_stack.approve_ask_stack import ApproveAskStack
from core.modules.asks.models.ask_stack import AskStack


class ApproveAskStackSubcommand(Subcommand[ApproveAskStack, AskStack]):
    """`journal ask-stack approve <n>`: a question stack an agent set takes effect."""

    cli_name = "ask-stack"
    name = "approve"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> ApproveAskStack:
        return ApproveAskStack(arguments.id)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, AskStack):
            output.line(f"the question stack of {value.topic} is in force")
