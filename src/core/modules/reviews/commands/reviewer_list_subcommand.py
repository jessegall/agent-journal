from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.reviews.queries.review_query import ReviewQuery
from core.modules.reviews.queries.reviewer_query import ReviewerQuery


class ReviewerListSubcommand(ReadSubcommand[tuple[str, ...]]):
    """`journal reviewer list`: each reviewer out with its state, then the waiting reviews in queue order, then how many of each."""

    cli_name = "reviewer"
    name = "list"

    def __init__(self, reviewers: ReviewerQuery, reviews: ReviewQuery) -> None:
        self.reviewers, self.reviews = reviewers, reviews

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> tuple[str, ...]:
        if caller.environment_id is None:
            raise Refusal("reviewers are listed for an environment", "name one with --environment")
        reviewers = tuple(self.reviewers.environment(caller.environment_id).out().oldest().all_rows())
        waiting = tuple(self.reviews.queued(caller.environment_id).all_rows())
        return (*(f"reviewer {reviewer.id}: {reviewer.state}" for reviewer in reviewers),
                *(f"waiting {place}: review {review.id}" for place, review in enumerate(waiting, 1)),
                f"reviewers: {len(reviewers)}, reviews waiting: {len(waiting)}")

    def write_output(self, value: object, output: Output) -> None:
        lines = value if isinstance(value, tuple) else ()
        output.write("\n".join(str(line) for line in lines), {"lines": list(lines)})
