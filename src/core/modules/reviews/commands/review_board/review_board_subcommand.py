from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.reviews.models.reviewer_row import ReviewerRow
from core.modules.reviews.support.reviewer_board import ReviewerBoard


class ReviewBoardSubcommand(ReadSubcommand[ReviewerBoard]):
    """`journal review board`: the reviews being done with their steps so far, and how many reviews wait, in
    the caller's environment."""

    cli_name = "review"
    name = "board"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        return

    def read(self, arguments: Namespace, caller: Caller) -> ReviewerBoard:
        rows = self.queries.query(ReviewerRow)
        return ReviewerBoard(tuple(rows.ordered("review_id", "row_type", "step_id").all_rows()))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, ReviewerBoard):
            output.write(f"{value.json()['queued']} waiting", value.json())
