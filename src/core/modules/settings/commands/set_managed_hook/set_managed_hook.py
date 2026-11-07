from dataclasses import dataclass

from core.base.command.command import Command
from core.base.provider.managed_hook import ManagedHook
from core.base.provider.managed_state import ManagedState


@dataclass(frozen=True)
class SetManagedHook(Command[ManagedHook]):
    """Sets one managed hook's state and time limit in seconds."""

    hook_id: str
    state: ManagedState
    timeout: int
