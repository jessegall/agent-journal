from collections.abc import Iterator, Sequence
from dataclasses import replace

from core.base.registry.setting_entry import ANY_KEY, GROUP_TYPE, SettingEntry
from core.base.setting.setting_group import SettingGroup
from core.base.setting.setting_scope import SettingScope
from core.base.setting.setting_value import SettingValue


class SettingTree:
    """Walks the settings tree a module declares, giving every node its full key: the module's name and the path
    of short keys down to it, so journal.core.sharing declares tunnel.token and gets
    journal.core.sharing.tunnel.token."""

    def entries(self, module_name: str, nodes: Sequence[SettingGroup | SettingValue]) -> Iterator[SettingEntry]:
        yield from self.walked(module_name, module_name, None, nodes)

    def walked(self, module_name: str, prefix: str, parent: str | None, nodes: Sequence[SettingGroup | SettingValue]) -> Iterator[SettingEntry]:
        for node in nodes:
            key = f"{prefix}.{node.key}"
            if isinstance(node, SettingGroup):
                yield SettingEntry(key, module_name, parent, node.title, node.description, GROUP_TYPE, None, False, SettingScope.LAYERED.value, False, (),
                                   node.toggleable, node.enabled)
                yield from self.walked(module_name, key, key, node.children)
                if node.any_key is not None:
                    yield from self.walked(module_name, key, key, [replace(node.any_key, key=ANY_KEY)])
            else:
                yield SettingEntry(key, module_name, parent, node.title, node.description, node.type.value, None if node.secret else node.default, node.secret,
                                   node.scope.value, node.agent_writable, tuple(node.choices), False, True)
