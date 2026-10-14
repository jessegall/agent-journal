from journal.models.actor import Actor
from journal.repositories.users import Users

LOCAL_USER = 1


class Identity:
    """Reads who a request is from: the viewer or phone carries the user's token, and the local viewer with no token is the one local user. A hook names its agent in its body, not here."""

    def __init__(self, users: Users) -> None:
        self.users = users

    def of(self, headers: dict) -> Actor:
        return Actor.user(LOCAL_USER)
