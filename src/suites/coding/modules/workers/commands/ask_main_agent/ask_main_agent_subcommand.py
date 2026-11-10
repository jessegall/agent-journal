from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.errors.refusal import Refusal
from engine.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.ask_main_agent.ask_main_agent import AskMainAgent

QUESTION_SHAPE = 'journal merger tell "<what>" --tried "<what you tried>" --option "<one>" --option "<two>" --recommend "<your choice>"'
LEAST_OPTION_COUNT = 2


class AskMainAgentSubcommand(Subcommand[AskMainAgent, None]):
    """`journal merger tell "<what>" --tried ... --option ... --option ... --recommend ...`: asks the main agent."""

    cli_name = "merger"
    name = "tell"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("problem")
        parser.add_argument("--tried")
        parser.add_argument("--option", action="append", default=[])
        parser.add_argument("--recommend")
        parser.add_argument("--worker", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> AskMainAgent:
        if not (arguments.problem.strip() and arguments.tried and arguments.recommend and len(arguments.option) >= LEAST_OPTION_COUNT):
            raise Refusal("a tell has four parts: what, what you tried, at least two options and your recommendation", QUESTION_SHAPE)
        return AskMainAgent(arguments.problem, arguments.tried, tuple(arguments.option), arguments.recommend, arguments.worker)
