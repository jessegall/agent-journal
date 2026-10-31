from argparse import ArgumentParser, Namespace

from core.base.actor import Actor, ActorType
from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from tests.core.base.test_commands import LoanMake
from tests.core.base.test_model import Loan

CALLER = Caller(Actor(7, ActorType.AGENT), environment_id=2)


class LoanMakeSubcommand(Subcommand[LoanMake, Loan]):
    cli_noun = "loan"
    name = "make"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("title")

    def command(self, arguments: Namespace, caller: Caller) -> LoanMake:
        return LoanMake(title=arguments.title)


def test_a_subcommand_reads_its_arguments_into_a_command():
    subcommand, parser = LoanMakeSubcommand(), ArgumentParser()
    subcommand.arguments(parser)
    assert subcommand.command(parser.parse_args(["Dune"]), CALLER) == LoanMake(title="Dune")
