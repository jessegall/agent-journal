class PushService:
    """A way to wake a phone: it sends an empty push to the endpoint the phone subscribed with and answers the status
    the push service gave, or 0 when nothing was sent."""

    def send(self, endpoint: str) -> int:
        raise NotImplementedError
