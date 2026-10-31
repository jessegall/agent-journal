from collections.abc import Iterator, Sequence

from core.base.module.module import Module
from core.base.setting.setting_group import SettingGroup
from core.base.setting.setting_tree import SettingTree
from core.base.setting.setting_value import SettingValue

TITLE_LIMIT_CHARACTERS = 40
DESCRIPTION_LIMIT_CHARACTERS = 120


class SettingCheck:
    """Refuses a settings tree a module cannot be synced with: two settings with one key, a default that is not
    of its setting's type, a group that holds nothing, a title or description past its length, and a secret with
    a default."""

    def problems(self, modules: Sequence[type[Module]]) -> tuple[str, ...]:
        return tuple(problem for module in modules for problem in self.module_problems(module))

    def module_problems(self, module: type[Module]) -> Iterator[str]:
        keys = [entry.key for entry in SettingTree().entries(module.name, module.settings)]
        for key in sorted({key for key in keys if keys.count(key) > 1}):
            yield f"{module.name} declares the setting {key} twice"
        yield from self.node_problems(module.name, module.settings)

    def node_problems(self, prefix: str, nodes: Sequence[SettingGroup | SettingValue]) -> Iterator[str]:
        for node in nodes:
            key = f"{prefix}.{node.key}"
            if len(node.title) > TITLE_LIMIT_CHARACTERS:
                yield f"the title of {key} is {len(node.title)} characters; a title is at most {TITLE_LIMIT_CHARACTERS}"
            if len(node.description) > DESCRIPTION_LIMIT_CHARACTERS:
                yield f"the description of {key} is {len(node.description)} characters; a description is at most {DESCRIPTION_LIMIT_CHARACTERS}"
            if isinstance(node, SettingGroup):
                if not node.children:
                    yield f"the setting group {key} holds no setting"
                yield from self.node_problems(key, node.children)
            elif node.secret and node.default is not None:
                yield f"the secret {key} has a default; a secret is set by the person, never written in code"
            elif node.default is not None and not node.accepts(node.default):
                yield f"the setting {key} is a {node.type.value}, but its default is {node.default!r}"
