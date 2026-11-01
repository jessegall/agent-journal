from core.modules.reviews.commands.review_board.review_board_subcommand import ReviewBoardSubcommand


class ReviewStepBoardSubcommand(ReviewBoardSubcommand):
    """`journal review-step board`: the same board, named for the steps so the reviewer window may follow
    their events."""

    cli_name = "review-step"
