from declaring.trigger import DAY, MINUTE
from framework import watched
from framework.sending import Sent


def open_a_day(context, agent) -> list[Sent]:
    return watched.found(watched.Watched("question", "open", "created", DAY / MINUTE), context, agent)
