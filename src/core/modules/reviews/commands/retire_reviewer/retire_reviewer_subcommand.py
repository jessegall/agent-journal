from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.reviews.commands.retire_reviewer.retire_reviewer import RetireReviewer
from core.modules.reviews.models.reviewer import Reviewer


class RetireReviewerSubcommand(Subcommand[RetireReviewer, Reviewer]):
    """`journal reviewer retire`: lets the newest idle reviewer go."""

    cli_name = "reviewer"
    name = "retire"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def command(self, arguments: Namespace, caller: Caller) -> RetireReviewer:
        return RetireReviewer()

    def write_output(self, value: object, output: Output) -> None:
        output.line(f"reviewer {value.id if isinstance(value, Reviewer) else value} is retired")
