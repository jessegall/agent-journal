from dataclasses import dataclass

from engine.provider.managed_hook import ManagedHook
from engine.provider.managed_hook_history import ManagedHookHistory


@dataclass(frozen=True)
class ManagedHookItem:
    """A managed hook with the outcomes of its recent runs."""

    hook: ManagedHook
    history: ManagedHookHistory
