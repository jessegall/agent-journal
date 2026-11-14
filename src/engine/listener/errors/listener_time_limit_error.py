class ListenerTimeLimitError(Exception):
    """A listener took longer on one event than the developer time limit allows, so it is held until the server restarts."""

    def __init__(self, listener: str, elapsed_ms: int, limit_ms: int, event_id: int, event: str) -> None:
        super().__init__(f"listener {listener} took {elapsed_ms} ms on event {event_id} {event}, over the limit of {limit_ms} ms:"
                         f" it runs no more events until the server restarts")
