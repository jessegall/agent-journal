from dataclasses import dataclass

from engine.time.timestamp import Timestamp


@dataclass(frozen=True)
class LibraryStatus:
    """What a user sees of the connection: the address and whether it is encrypted, the server, the user and their
    role, when the server was last reached, the last failure and why sync stopped."""

    is_connected: bool
    address: str = ""
    is_encrypted: bool = False
    server_name: str = ""
    user_name: str = ""
    role: str = ""
    reached_at: Timestamp | None = None
    failure: str = ""
    stopped: str = ""
