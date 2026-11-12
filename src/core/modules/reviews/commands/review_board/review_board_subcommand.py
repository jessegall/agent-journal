from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.query.queries import Queries
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.reviews.models.reviewer_row import ReviewerRow
from core.modules.reviews.support.reviewer_board import ReviewerBoard

BOARD_REASON = "the reviewer board shows every review with its steps"


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
        return ReviewerBoard(tuple(sorted(rows.every_row(BOARD_REASON), key=lambda row: (row.review_id, row.row_type, row.step_id or 0))))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, ReviewerBoard):
            output.write(f"{value.json()['queued']} waiting", value.json())
