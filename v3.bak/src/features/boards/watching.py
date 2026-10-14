import time

from controllers.types import Boards
from framework.sending import Sent


def boards_wanting_ideas(context, agent) -> list[Sent]:
    every = context.feature.interval(context.record, "ideas")
    return [Sent(str(board.n), {"n": board.n, "title": board.title}) for board in context.journal.get(Boards).rows.standing()
            if board.environment == context.record.env and not board.finished and time.time() - float(board.ideas_at) >= every]
