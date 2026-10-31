from collections.abc import Sequence

from core.base.declaration_names import DeclarationNames
from core.base.chat.mark_click import MarkClick
from core.base.chat.mark_family import MarkFamily
from core.base.module.button_check import ButtonCheck
from core.base.module.module import Module
from core.base.module.name_groups import NameGroups
from core.base.module.window_check import WindowCheck


class MarkCheck:
    """Checks the chat marks the modules declare before a sync writes anything: each type starts with its
    module's name and is used once, each has variants, a family belongs
    to one module and is declared the same way each time, its icons are in the shell's icon set, its
    buttons run commands, its body is in the module's web/dist and a click that opens a row has a row to
    open."""

    def __init__(self, buttons: ButtonCheck) -> None:
        self.buttons = buttons

    def problems(self, modules: Sequence[type[Module]]) -> tuple[str, ...]:
        runs = frozenset(WindowCheck.lines(modules)[1])
        problems = list(NameGroups.duplicates([("mark types", [mark.type.value for module in modules for mark in module.marks])]))
        problems += self.family_problems(modules)
        for module in modules:
            problems += self.module_problems(module, runs)
        return tuple(problems)

    def module_problems(self, module: type[Module], runs: frozenset[str]) -> list[str]:
        problems: list[str] = []
        for mark in module.marks:
            name = mark.type.value
            problems += DeclarationNames.prefix_problems(f"the mark {name}", name, module.name)
            if not tuple(mark.variants):
                problems.append(f"the mark {name} has a variants enum, {mark.variants.__name__}, with no members")
            problems += mark.problems()
            problems += DeclarationNames.icon_problems(f"the mark {name}", mark.mark_icon, mark.family.icon)
            problems += self.buttons.problems(f"the mark {name}", (*mark.buttons, *mark.group_buttons), runs)
            if mark.body and not (module.web_folder() / mark.body).exists():
                problems.append(f"the mark {name} loads {mark.body}, which is not in its module's web/dist")
            if mark.click is MarkClick.OPEN_ROW and not (module.models or module.dependencies):
                problems.append(f"the mark {name} opens a row, and {module.name} declares and depends on no row model")
        return problems

    def family_problems(self, modules: Sequence[type[Module]]) -> list[str]:
        declared: dict[str, tuple[str, MarkFamily]] = {}
        problems: list[str] = []
        for module in modules:
            for mark in module.marks:
                owner, family = declared.setdefault(mark.family.name, (module.name, mark.family))
                if owner != module.name:
                    problems.append(f"the mark family {family.name} is declared by {owner} and by {module.name}")
                elif family != mark.family:
                    problems.append(f"the mark family {family.name} is declared twice by {module.name} with different fields")
        return list(dict.fromkeys(problems))
