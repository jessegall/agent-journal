from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class ConnectionProposal:
    """What the desk shows to pair a phone: the link the phone opens, the short code it may type instead at the address, and when both stop working."""

    link: str
    short: str
    address: str
    until: datetime
