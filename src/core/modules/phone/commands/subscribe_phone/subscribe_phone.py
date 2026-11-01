from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.phone.models.phone import Phone


@dataclass(frozen=True)
class SubscribePhone(Command[Phone]):
    """Keeps the push subscription a paired phone gave, found by the digest of its session token; none takes it
    away."""

    token_digest: str
    subscription: str | None
