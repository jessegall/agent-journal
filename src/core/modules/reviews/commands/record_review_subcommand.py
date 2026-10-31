from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.reviews.commands.record_review import RecordReview
from core.modules.reviews.models.review import Review


class RecordReviewSubcommand(Subcommand[RecordReview, Review]):
    """`journal review record "<report>"`: a reviewer's one report on its review, one line per point: passed, short with why, or undecided with why."""

    cli_name = "review"
    name = "record"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("report")
        parser.add_argument("--review", type=int, dest="review_id")

    def command(self, arguments: Namespace, caller: Caller) -> RecordReview:
        return RecordReview(arguments.report, arguments.review_id)
