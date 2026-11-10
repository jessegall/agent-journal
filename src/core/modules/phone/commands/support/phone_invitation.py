from dataclasses import dataclass

from engine.time.timestamp import Timestamp


@dataclass(frozen=True)
class PhoneInvitation:
    """What a person shows a phone to pair it: the code, the link that carries it, and when it stops working.
    """

    code: str
    link: str
    expires_at: Timestamp
