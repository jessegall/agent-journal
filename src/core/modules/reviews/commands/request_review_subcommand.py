from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.reviews.commands.request_review import RequestReview
from core.modules.reviews.models.review import Review


class RequestReviewSubcommand(Subcommand[RequestReview, Review]):
    """`journal review request <model> <id> --points <count>`: queues a review of the work on a row, checked point by point."""

    cli_name = "review"
    name = "request"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("subject_model")
        parser.add_argument("subject_id", type=int)
        parser.add_argument("--points", type=int, required=True, dest="point_count")
        parser.add_argument("--brief", default="")

    def command(self, arguments: Namespace, caller: Caller) -> RequestReview:
        return RequestReview(arguments.subject_model, arguments.subject_id, caller.actor.id, arguments.point_count, arguments.brief)
