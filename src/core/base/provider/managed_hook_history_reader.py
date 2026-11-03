from typing import Protocol

from core.base.provider.managed_hook import ManagedHook
from core.base.provider.managed_hook_history import ManagedHookHistory


class ManagedHookHistoryReader(Protocol):
    """Reads recent outcomes without depending on the module that records them."""

    def read(self, hook: ManagedHook) -> ManagedHookHistory: ...
