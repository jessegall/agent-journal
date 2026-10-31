from argparse import ArgumentParser, Namespace

from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from tests.core.base.test_commands import LoanMake
from tests.core.base.test_model import Loan


class LoanMakeOwn(Subcommand[LoanMake, Loan]):
    cli_noun = "loan"
    name = "make"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("title")

    def command(self, arguments: Namespace, caller: Caller) -> LoanMake:
        return LoanMake(title=arguments.title.title())
