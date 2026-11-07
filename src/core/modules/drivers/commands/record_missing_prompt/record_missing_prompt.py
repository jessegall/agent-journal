from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.drivers.models.hook_call import HookCall


@dataclass(frozen=True)
class RecordMissingPrompt(Command[HookCall]):
    """Keeps a prompt typed in the caller's terminal whose own hook never reached the journal, as the prompt hook
    call it would have made."""

    lock = False

    text: str
