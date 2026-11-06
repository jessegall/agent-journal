from core.base.listener.round_yield import RoundYield
from server.hook.server_queue import ServerQueue

GIVE_WAY_LIMIT_SECONDS = 0.25


class QueueRoundYield(RoundYield):
    """Holds a round back while a hook runs or waits on the server queue, for a short limit, so a hook gets the
    database between the round's writes and a busy server never stalls the round."""

    def __init__(self, queue: ServerQueue, limit_seconds: float = GIVE_WAY_LIMIT_SECONDS) -> None:
        self.queue, self.limit_seconds = queue, limit_seconds

    def give_way(self) -> None:
        self.queue.wait_for_hooks(self.limit_seconds)
