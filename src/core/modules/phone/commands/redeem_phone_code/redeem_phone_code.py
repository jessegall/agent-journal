from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.phone.models.phone import Phone


@dataclass(frozen=True)
class RedeemPhoneCode(Command[Phone]):
    """Pairs the phone that brought a pairing code, keeping the digest of the session token the viewer gave it."""

    code: str
    token_digest: str
    name: str
