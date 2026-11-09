from dataclasses import dataclass


@dataclass(frozen=True)
class DoorRequest:
    """What the door judges of a request before anything reads its body: who connected, which host, origin and
    site it names, whether it changes state, whether it carries a login, and how large its body is."""

    peer_uid: int
    host: str
    origin: str
    site_relation: str
    is_change: bool
    has_login: bool
    body_bytes: int
