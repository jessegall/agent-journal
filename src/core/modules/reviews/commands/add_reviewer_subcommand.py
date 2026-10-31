from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.reviews.commands.add_reviewer import AddReviewer
from core.modules.reviews.models.reviewer import Reviewer


class AddReviewerSubcommand(Subcommand[AddReviewer, Reviewer]):
    """`journal reviewer add`: starts a reviewer, when reviewers are on and fewer than the limit are out."""

    cli_name = "reviewer"
    name = "add"

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def command(self, arguments: Namespace, caller: Caller) -> AddReviewer:
        return AddReviewer()
