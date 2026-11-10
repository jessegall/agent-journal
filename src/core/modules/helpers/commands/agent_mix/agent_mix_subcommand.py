from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.helpers.support.agent_use import AgentUse


class AgentMixSubcommand(ReadSubcommand[str]):
    """`journal agent mix`: the jobs of each type of agent by model lately, and the agents kept of it, to decide
    what to retire."""

    cli_name = "agent"
    name = "mix"

    def __init__(self, use: AgentUse) -> None:
        self.use = use

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> str:
        return self.use.report()

    def write_output(self, value: object, output: Output) -> None:
        output.line(str(value))
