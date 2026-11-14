KEPT_MESSAGES = 1000


class RecentMessages:
    """The newest messages that were passed on, at most a limit of them: the oldest is forgotten first."""

    def __init__(self, limit: int = KEPT_MESSAGES) -> None:
        self.limit = limit
        self.messages: dict[str, None] = {}

    def contains(self, message: str) -> bool:
        return message in self.messages

    def remember(self, message: str) -> None:
        self.messages[message] = None
        if len(self.messages) > self.limit:
            del self.messages[next(iter(self.messages))]
