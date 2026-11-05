from collections.abc import Mapping, Sequence
from dataclasses import asdict, dataclass

from core.base.provider.managed_hook import ManagedHook
from core.modules.settings.support.managed_hook_item import ManagedHookItem
from core.modules.settings.support.unmanaged_hook import UnmanagedHook


@dataclass(frozen=True)
class ProjectHookList:
    """The project hook settings page's managed, pending and excluded entries."""

    managed: Sequence[ManagedHookItem]
    pending: Sequence[ManagedHook]
    unmanaged: Sequence[UnmanagedHook]
    fallback: bool

    def lines(self) -> Sequence[str]:
        return [f"Managed: {len(self.managed)}", f"Pending: {len(self.pending)}", f"Not managed: {len(self.unmanaged)}"]

    def json(self) -> Mapping[str, object]:
        return asdict(self)
