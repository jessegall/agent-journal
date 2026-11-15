from collections.abc import Sequence
from dataclasses import dataclass

from engine.provider.managed_hook import ManagedHook
from engine.provider.managed_hook_history import ManagedHookHistory


@dataclass(frozen=True)
class ManagedHookItem:
    """A managed hook with the outcomes of its recent runs and the facts of how it runs that the viewer shows."""

    hook: ManagedHook
    history: ManagedHookHistory
    facts: Sequence[str] = ()

    @classmethod
    def of(cls, hook: ManagedHook, history: ManagedHookHistory) -> "ManagedHookItem":
        return cls(hook, history, tuple(hook.facts()))
