from collections.abc import Iterator, Sequence

from core.base.registry.setting_entry import SettingEntry
from core.base.setting.setting_declaration import SettingNode


class SettingTree:
    """Walks the settings tree a module declares, giving every node its full key: the module's name and the path
    of short keys down to it, so journal.core.sharing declares tunnel.token and gets
    journal.core.sharing.tunnel.token."""

    def entries(self, module_name: str, nodes: Sequence[SettingNode]) -> Iterator[SettingEntry]:
        yield from self.walked(module_name, module_name, None, nodes)

    def walked(self, module_name: str, prefix: str, parent: str | None, nodes: Sequence[SettingNode]) -> Iterator[SettingEntry]:
        for node in nodes:
            key = f"{prefix}.{node.key}"
            declared = node.declaration()
            yield SettingEntry(key, module_name, parent, declared.title, declared.description, declared.type, declared.default, declared.secret, declared.scope,
                               declared.agent_writable, tuple(declared.choices), declared.toggleable, declared.enabled, declared.target)
            yield from self.walked(module_name, key, key, node.members())
