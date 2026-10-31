from collections.abc import Iterator, Sequence

from core.base.module.module import Module
from core.base.registry.setting_entry import GROUP_TYPE, REFERENCE_TYPE, SettingEntry
from core.base.setting.setting_group import SettingGroup
from core.base.setting.setting_reference import SettingReference
from core.base.registry.setting_tree import SettingTree
from core.base.setting.setting_value import SettingValue

TITLE_LIMIT_CHARACTERS = 40
DESCRIPTION_LIMIT_CHARACTERS = 120


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

    def node_problems(self, prefix: str, nodes: Sequence[SettingGroup | SettingValue | SettingReference]) -> Iterator[str]:
        for node in nodes:
            yield from node.checked(self, f"{prefix}.{node.key}")

    def group_problems(self, group: SettingGroup, key: str) -> Iterator[str]:
        yield from self.length_problems(group, key)
        if not group.children and group.any_key is None:
            yield f"the setting group {key} holds no setting"
        yield from self.node_problems(key, group.children)

    def value_problems(self, value: SettingValue, key: str) -> Iterator[str]:
        yield from self.length_problems(value, key)
        if value.secret and value.default is not None:
            yield f"the secret {key} has a default; a secret is set by the person, never written in code"
        elif value.default is not None and not value.accepts(value.default):
            yield f"the setting {key} is a {value.type.value}, but its default is {value.default!r}"

    @staticmethod
    def length_problems(node: SettingGroup | SettingValue, key: str) -> Iterator[str]:
        if len(node.title) > TITLE_LIMIT_CHARACTERS:
            yield f"the title of {key} is {len(node.title)} characters; a title is at most {TITLE_LIMIT_CHARACTERS}"
        if len(node.description) > DESCRIPTION_LIMIT_CHARACTERS:
            yield f"the description of {key} is {len(node.description)} characters; a description is at most {DESCRIPTION_LIMIT_CHARACTERS}"

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
