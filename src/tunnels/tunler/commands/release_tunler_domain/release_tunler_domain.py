from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class ReleaseTunlerDomain(Command[str]):
    """Takes a domain off the logged-in tunler account, so anyone can claim it."""

    lock = False

    domain: str
