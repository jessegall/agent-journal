from collections.abc import Iterator, Sequence

from core.base.registry.setting_entry import SettingEntry
from core.base.setting.setting_group import SettingGroup
from core.base.setting.setting_reference import SettingReference
from core.base.setting.setting_value import SettingValue


class SettingTree:
    """Walks the settings tree a module declares, giving every node its full key: the module's name and the path
    of short keys down to it, so journal.core.sharing declares tunnel.token and gets
    journal.core.sharing.tunnel.token."""

    def entries(self, module_name: str, nodes: Sequence[SettingGroup | SettingValue | SettingReference]) -> Iterator[SettingEntry]:
        for node in nodes:
            yield from node.declared(module_name, f"{module_name}.{node.key}", None)
