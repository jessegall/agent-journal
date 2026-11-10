from typing import Protocol, runtime_checkable

from engine.provider.managed_hook import ManagedHook
from engine.provider.managed_hook_history import ManagedHookHistory


@runtime_checkable
class ManagedHookHistoryReader(Protocol):
    """Reads recent outcomes without depending on the module that records them."""

    def read(self, hook: ManagedHook) -> ManagedHookHistory: ...
