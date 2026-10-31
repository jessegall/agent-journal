from server.viewer.phone_sessions import PhoneSessions


class NoPhones(PhoneSessions):
    """Phone sessions with no paired phone, for login tests that need no journal."""

    def __init__(self) -> None:
        return

    def person_id(self, token: str) -> int | None:
        return None
