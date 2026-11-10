from dataclasses import dataclass

from engine.command.command import Command
from core.modules.phone.commands.support.push_key_pair import PushKeyPair


@dataclass(frozen=True)
class EnsurePushKeys(Command[PushKeyPair]):
    """Gives the journal's push keys, making and keeping them first when this is the first need."""
