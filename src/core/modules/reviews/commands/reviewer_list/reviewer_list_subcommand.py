from argparse import Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.reviews.commands.support.reviewer_listing import ReviewerListing
from core.modules.reviews.queries.review_query import ReviewQuery
from core.modules.reviews.queries.reviewer_query import ReviewerQuery


class ReviewerListSubcommand(ReadSubcommand[ReviewerListing]):
    """`journal reviewer list`: each reviewer out with its state, then the waiting reviews in queue order,
    then how many of each."""

    cli_name = "reviewer"
    name = "list"
    environment_refusal = "reviewers are listed for an environment"

    def __init__(self, reviewers: ReviewerQuery, reviews: ReviewQuery) -> None:
        self.reviewers, self.reviews = reviewers, reviews

    def read(self, arguments: Namespace, caller: Caller) -> ReviewerListing:
        reviewers = tuple(self.reviewers.active().oldest().all_rows())
        waiting = tuple(self.reviews.queued().all_rows())
        return ReviewerListing((*(f"reviewer {reviewer.id}: {reviewer.state}" for reviewer in reviewers),
                                *(f"waiting {place}: review {review.id}" for place, review in enumerate(waiting, 1)),
                                f"reviewers: {len(reviewers)}, reviews waiting: {len(waiting)}"))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, ReviewerListing):
            output.write("\n".join(value.lines), {"lines": list(value.lines)})
