from journal.models.actor import Actor
from journal.repositories.users import Users


class Identity:
    """Reads who a request is from: a hook names its agent, a viewer or phone request carries the user's token, and the local viewer with no token is the one local user."""

    def __init__(self, users: Users) -> None: ...

    def of(self, headers: dict, path: str) -> Actor: ...
