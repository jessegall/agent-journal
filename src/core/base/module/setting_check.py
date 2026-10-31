from collections.abc import Iterator, Sequence

from core.base.module.module import Module
from core.base.registry.setting_entry import SettingEntry
from core.base.setting.setting_declaration import GROUP_TYPE, REFERENCE_TYPE
from core.base.setting.setting_declaration import SettingNode
from core.base.registry.setting_tree import SettingTree


class SettingCheck:
    """Refuses a settings tree a module cannot be synced with: two settings with one key, a default that is
    not of its setting's type, a group that holds nothing, a title or description past its length, and a
    secret with a default."""

    def problems(self, modules: Sequence[type[Module]]) -> tuple[str, ...]:
        return (*(problem for module in modules for problem in self.module_problems(module)), *self.reference_problems(modules))

    def module_problems(self, module: type[Module]) -> Iterator[str]:
        keys = [entry.key for entry in SettingTree().entries(module.name, module.settings)]
        for key in sorted({key for key in keys if keys.count(key) > 1}):
            yield f"{module.name} declares the setting {key} twice"
        yield from self.node_problems(module.name, module.settings)

    def node_problems(self, prefix: str, nodes: Sequence[SettingNode]) -> Iterator[str]:
        for node in nodes:
            yield from node.problems(f"{prefix}.{node.key}")

    def reference_problems(self, modules: Sequence[type[Module]]) -> Iterator[str]:
        entries = [entry for module in modules for entry in SettingTree().entries(module.name, module.settings)]
        groups = {entry.key: entry for entry in entries if entry.type == GROUP_TYPE}
        names = {module.name for module in modules}
        for reference in (entry for entry in entries if entry.type == REFERENCE_TYPE):
            owner = max((name for name in names if reference.target.startswith(f"{name}.")), key=len, default=None)
            if owner is None:
                continue
            if reference.target not in groups:
                yield f"{reference.module} places {reference.target}, which the module {owner} does not declare"
            elif self.is_circular(reference, entries, groups, set()):
                yield f"{reference.module} places {reference.target}, which holds it"

    def is_circular(self, reference: SettingEntry, entries: Sequence[SettingEntry], groups: dict[str, SettingEntry], visited: set[str]) -> bool:
        enclosing = self.enclosing_keys(reference, groups)
        if reference.target in enclosing:
            return True
        visited.add(reference.target)
        nested = [entry for entry in entries if entry.type == REFERENCE_TYPE and entry.key != reference.key and self.has_ancestor(entry, reference.target, groups)]
        return any(entry.target in enclosing or self.continues_cycle(entry, entries, groups, visited) for entry in nested)

    def continues_cycle(self, reference: SettingEntry, entries: Sequence[SettingEntry], groups: dict[str, SettingEntry], visited: set[str]) -> bool:
        return reference.target in groups and reference.target not in visited and self.is_circular(reference, entries, groups, visited)

    @staticmethod
    def enclosing_keys(entry: SettingEntry, groups: dict[str, SettingEntry]) -> set[str]:
        keys: set[str] = set()
        parent = entry.parent
        while parent is not None:
            keys.add(parent)
            parent = groups[parent].parent if parent in groups else None
        return keys

    @staticmethod
    def has_ancestor(entry: SettingEntry, group_key: str, groups: dict[str, SettingEntry]) -> bool:
        parent = entry.parent
        while parent is not None:
            if parent == group_key:
                return True
            parent = groups[parent].parent if parent in groups else None
        return False
