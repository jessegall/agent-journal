from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.phone.commands.push_key_pair import PushKeyPair


@dataclass(frozen=True)
class EnsurePushKeys(Command[PushKeyPair]):
    """Gives the journal's push keys, making and keeping them first when this is the first need."""
