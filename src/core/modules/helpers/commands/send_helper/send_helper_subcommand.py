from engine.cli.agent_number import AgentNumber
from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.helpers.commands.send_helper.send_helper import SendHelper
from core.modules.agents.support.agent_label import AgentLabel
from core.modules.agents.support.agent_rows import AgentRows


class SendHelperSubcommand(Subcommand[SendHelper, int]):
    """`journal helper send <n> "<job>"`."""

    cli_name = "helper"
    name = "send"
    outward = True

    def __init__(self, agents: AgentRows) -> None:
        self.agents = agents

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("helper_id", type=AgentNumber)
        parser.add_argument("job")
        parser.add_argument("--plan", type=int, default=None, help="the plan this job reviews")
        parser.add_argument("--title", default="", help="a short title for the job, shown in the agent list")
        parser.add_argument("--steer", action="store_true", help="add this to the job the helper is working on")

    def command(self, arguments: Namespace, caller: Caller) -> SendHelper:
        return SendHelper(arguments.helper_id, arguments.job, arguments.steer, arguments.plan, arguments.title)

    def write_output(self, value: object, output: Output) -> None:
        output.write(f"{AgentLabel.labelled(self.agents.find(value)).text} takes the job", {"helper_id": value})

